import { Order } from "../../models/order.js";
import { Product } from "../../models/products.js";
import { Notification } from "../../models/notification.js";
import { ResponseMessage } from "../../function/responseMessage.js";
import { paginationLabel } from "../../function/paginateFn.js";

export const orderResolvers = {
  Query: {
    // Get all orders by user
    getOrders: async (_, { userId }) => {
      try {
        const orders = await Order.find({ userId })
          .populate("items.productId")
          .sort({ createdAt: -1 })
          .lean();

        return orders.map((order) => ({
          id: order._id.toString(),
          userId: order.userId,
          shippingInfo: order.shippingInfo,
          totalPrice: order.totalPrice,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentProof: order.paymentProof,
          createdAt: order.createdAt,
          items: order.items
            .map((item) =>
              item.productId
                ? {
                    product: {
                      ...item.productId,
                      id: item.productId._id.toString(),
                    },
                    quantity: item.quantity,
                    price: item.price,
                  }
                : null
            )
            .filter(Boolean),
        }));
      } catch (err) {
        console.error(err);
        return [];
      }
    },

    // Get order by ID
    getOrderById: async (_, { _id }) => {
      try {
        const order = await Order.findById(_id).populate("items.productId").lean();
        if (!order) return null;

        return {
          id: order._id.toString(),
          userId: order.userId,
          shippingInfo: order.shippingInfo,
          totalPrice: order.totalPrice,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentProof: order.paymentProof,
          createdAt: order.createdAt,
          items: order.items
            .map((item) =>
              item.productId
                ? {
                    product: {
                      ...item.productId,
                      id: item.productId._id.toString(),
                    },
                    quantity: item.quantity,
                    price: item.price,
                  }
                : null
            )
            .filter(Boolean),
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    // Get orders with pagination
    getOrdersWithPagination: async (_, { page, limit, pagination, keyword, status }) => {
      try {
        const query = { $and: [] };

        if (keyword && keyword.trim() !== "") {
          query.$and.push({
            $or: [
              { "shippingInfo.name": { $regex: keyword.trim(), $options: "i" } },
              { "shippingInfo.email": { $regex: keyword.trim(), $options: "i" } },
            ],
          });
        }

        if (status && status.trim() !== "") {
          query.$and.push({ status: status.trim() });
        }

        if (query.$and.length === 0) delete query.$and;

        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: paginationLabel,
          pagination,
          populate: { path: "items.productId", select: "productName imageUrl price category" },
          lean: true,
        };

        const orderData = await Order.paginate(query, options);

        orderData.data = orderData.data.map((order) => ({
          id: order._id.toString(),
          userId: order.userId,
          shippingInfo: order.shippingInfo,
          totalPrice: order.totalPrice,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentProof: order.paymentProof,
          createdAt: order.createdAt,
          items: order.items
            .map((item) =>
              item.productId
                ? {
                    product: {
                      ...item.productId,
                      id: item.productId._id.toString(),
                    },
                    quantity: item.quantity,
                    price: item.price,
                  }
                : null
            )
            .filter(Boolean),
        }));

        return orderData;
      } catch (err) {
        console.error(err);
        return {
          data: [],
          paginator: {
            totalDocs: 0,
            totalPages: 0,
            currentPage: page || 1,
            perPage: limit || 10,
          },
        };
      }
    },
  },

  Mutation: {
    // Create new order
    createOrder: async (_, { input }) => {
      try {
        const orderItems = await Promise.all(
          input.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            return {
              productId: product._id,
              quantity: item.quantity,
              price: product.price,
            };
          })
        );

        const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const newOrder = new Order({
          userId: input.userId,
          shippingInfo: input.shippingInfo,
          items: orderItems,
          totalPrice,
          paymentMethod: input.paymentMethod || "cash",
          paymentProof: input.paymentProof || null,
        });

        await newOrder.save();

        // Optional notification creation
        await Notification.create({
          message: `New order from user (${input.userId})`,
          orderId: newOrder._id,
        });

        return ResponseMessage(true, "Order created successfully");
      } catch (err) {
        console.error(err);
        return ResponseMessage(false, err.message || "Failed to create order");
      }
    },

    // Cancel order
    cancelOrder: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) throw new Error("Order not found");
        if (order.status !== "Pending") throw new Error("Only pending orders can be cancelled");

        order.status = "Cancelled";
        await order.save();
        return order;
      } catch (err) {
        console.error(err);
        throw new Error(err.message);
      }
    },

  
    // ✅ Update order status safely
updateOrderStatus: async (_, { _id, status }) => {
  try {
    const order = await Order.findById(_id);
    if (!order) return ResponseMessage(false, "Order not found");

    const validTransitions = {
      Pending: ["Accepted", "Cancelled"],
      Accepted: ["Processing", "Cancelled"],
      Processing: ["Delivered", "Cancelled"],
      Delivered: ["Completed"],
      Completed: [],
      Cancelled: [],
    };

    const currentStatus = order.status;
    const allowed = validTransitions[currentStatus] || [];
    
    if (!allowed.includes(status)) {
      return ResponseMessage(
        false,
        `Cannot change from "${currentStatus}" to "${status}".`
      );
    }

    order.status = status;
    await order.save();

    // Optionally send notification
    await Notification.create({
      userId: order.userId,
      orderId: order._id,
      type: "OrderStatus",
      message: `Your order has been ${status.toLowerCase()}.`,
    });

    return ResponseMessage(true, `Order updated to ${status}`);
  } catch (err) {
    console.error(err);
    return ResponseMessage(false, "Failed to update order status");
  }
},


    // Delete order
    deleteOrder: async (_, { _id }) => {
      try {
        const order = await Order.findByIdAndDelete(_id);
        if (!order) return ResponseMessage(false, "Order not found");
        return ResponseMessage(true, "Order deleted successfully");
      } catch (err) {
        console.error(err);
        return ResponseMessage(false, "Failed to delete order");
      }
    },

    // Proceed to checkout (from ecommerce)
    proceedToCheckout: async (_, { userId, shippingInfo, items, paymentMethod, paymentProof }) => {
      try {
        if (!userId) throw new Error("User ID is required");
        if (!shippingInfo?.name || !shippingInfo?.phone || !shippingInfo?.address)
          throw new Error("Shipping info required");
        if (!items || !items.length) throw new Error("Cart cannot be empty");
        if (paymentMethod === "aba" && !paymentProof) throw new Error("ABA proof required");

        const orderItems = await Promise.all(
          items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            return {
              productId: product._id,
              quantity: item.quantity,
              price: product.price,
            };
          })
        );

        const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const newOrder = new Order({
          userId,
          shippingInfo,
          items: orderItems,
          totalPrice,
          paymentMethod: paymentMethod || "cash",
          paymentProof: paymentProof || null,
          status: "Pending",
        });

        await newOrder.save();

        return ResponseMessage(true, "Order placed successfully");
      } catch (err) {
        console.error(err);
        return ResponseMessage(false, err.message || "Failed to checkout");
      }
    },
  },
};
