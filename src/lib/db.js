import {
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_AUTOMATIC_OFFERS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_BLOGS,
  INITIAL_HOMEPAGE_SECTIONS,
} from './seed-data';

function getDefaultState() {
  return {
    categories: [...INITIAL_CATEGORIES],
    collections: [...INITIAL_COLLECTIONS],
    products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    carts: [],
    orders: [],
    users: [
      {
        id: 'user-admin',
        email: 'admin@vedapavitra.com',
        passwordHash: '$2a$10$w85o38hV3hJkQ.bXWpT8lO4xH6zVqf8CsmH8Ew8p.O4Lg3N.r10iS',
        firstName: 'Vedic',
        lastName: 'Admin',
        phone: '+919876543210',
        role: 'SUPER_ADMIN',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'user-demo-customer',
        email: 'customer@vedapavitra.com',
        passwordHash: '$2a$10$w85o38hV3hJkQ.bXWpT8lO4xH6zVqf8CsmH8Ew8p.O4Lg3N.r10iS',
        firstName: 'Rohan',
        lastName: 'Verma',
        phone: '+919811223344',
        role: 'CUSTOMER',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    coupons: [...INITIAL_COUPONS],
    automaticOffers: [...INITIAL_AUTOMATIC_OFFERS],
    reviews: [...INITIAL_REVIEWS],
    blogs: [...INITIAL_BLOGS],
    faqs: [...INITIAL_FAQS],
    contactInquiries: [],
    wholesaleInquiries: [],
    newsletterSubscribers: [],
    homepageSections: [...INITIAL_HOMEPAGE_SECTIONS],
    redirects: [
      {
        id: 'red-1',
        sourcePath: '/old-mysore-incense',
        targetPath: '/products/mysore-sandalwood-bambooless-incense',
        type: 'PERMANENT_301',
        isActive: true,
      },
    ],
    auditLogs: [],
    settings: {
      STORE_NAME: 'VedaPavitra',
      STORE_TAGLINE: 'Pure Vedic Samagri & Bambooless Incense',
      FREE_SHIPPING_THRESHOLD: '499',
      FLAT_SHIPPING_FEE: '50',
      WHATSAPP_NUMBER: '919876543210',
      SUPPORT_EMAIL: 'care@vedapavitra.com',
      SUPPORT_PHONE: '+91 (0120) 489-7200',
      REGISTERED_OFFICE:
        'VedaPavitra Vedic Wellness, Plot 42, Udyog Vihar, Sahibabad, Ghaziabad, UP - 201010',
      GSTIN: '07AABCU9603R1ZM',
    },
    orderCounter: 1000,
  };
}

let memoryState = null;

function loadState() {
  if (memoryState) return memoryState;

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedapavitra_store_state');
      if (stored) {
        memoryState = JSON.parse(stored);
        return memoryState;
      }
    }
  } catch (err) {
    console.error('Error reading localStorage store, falling back to initial state:', err);
  }

  memoryState = getDefaultState();
  saveState();
  return memoryState;
}

function saveState() {
  if (!memoryState) return;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('vedapavitra_store_state', JSON.stringify(memoryState));
    }
  } catch (err) {
    console.error('Error writing localStorage store:', err);
  }
}

export const db = {
  // --- Categories & Collections ---
  getCategories() {
    return loadState().categories.filter((c) => c.isActive);
  },
  getCategoryBySlug(slug) {
    return loadState().categories.find((c) => c.slug === slug);
  },
  getCollections() {
    return loadState().collections.filter((c) => c.isActive);
  },
  getCollectionBySlug(slug) {
    return loadState().collections.find((c) => c.slug === slug);
  },

  // --- Products Catalog ---
  getProducts(params = {}) {
    const state = loadState();
    let list = state.products.filter((p) => p.isPublished);

    if (params.categorySlug) {
      const cat = state.categories.find((c) => c.slug === params.categorySlug);
      if (cat) {
        list = list.filter((p) => p.categoryIds.includes(cat.id));
      }
    }

    if (params.collectionSlug) {
      const col = state.collections.find((c) => c.slug === params.collectionSlug);
      if (col) {
        list = list.filter((p) => p.collectionIds.includes(col.id));
      }
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDesc?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.variants.some((v) => v.fragrance?.toLowerCase().includes(q))
      );
    }

    if (params.fragrance) {
      list = list.filter((p) =>
        p.variants.some((v) => v.fragrance?.toLowerCase() === params.fragrance?.toLowerCase())
      );
    }

    if (params.packSize) {
      list = list.filter((p) =>
        p.variants.some((v) => v.packSize?.toLowerCase().includes(params.packSize?.toLowerCase() || ''))
      );
    }

    if (params.minPrice !== undefined) {
      list = list.filter((p) => p.variants.some((v) => v.price >= params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      list = list.filter((p) => p.variants.some((v) => v.price <= params.maxPrice));
    }

    if (params.inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.stockQuantity > 0));
    }

    // Sorting
    switch (params.sort) {
      case 'price-asc':
        list.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
        break;
      case 'rating':
        list.sort((a, b) => b.ratingAverage - a.ratingAverage);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestselling':
      default:
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 24;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return { products: paginated, total };
  },

  getProductBySlug(slug) {
    return loadState().products.find((p) => p.slug === slug);
  },

  getProductById(id) {
    return loadState().products.find((p) => p.id === id);
  },

  // --- Cart System ---
  getCart(identifier = {}) {
    const state = loadState();
    let cart;

    if (identifier.cartId) {
      cart = state.carts.find((c) => c.id === identifier.cartId);
    } else if (identifier.userId) {
      cart = state.carts.find((c) => c.userId === identifier.userId);
    } else if (identifier.guestToken) {
      cart = state.carts.find((c) => c.guestToken === identifier.guestToken);
    }

    if (!cart) {
      cart = {
        id: 'cart-' + Math.random().toString(36).substring(2, 10),
        userId: identifier.userId,
        guestToken: identifier.guestToken || Math.random().toString(36).substring(2, 12),
        items: [],
        appliedCoupon: undefined,
        updatedAt: new Date().toISOString(),
      };
      state.carts.push(cart);
      saveState();
    }

    this.reconcileAutomaticOffers(cart);
    return cart;
  },

  addItemToCart(identifier = {}, productId, variantId, quantity = 1) {
    if (typeof identifier === 'object' && identifier !== null && identifier.productId) {
      productId = identifier.productId;
      variantId = identifier.variantId;
      quantity = identifier.quantity || 1;
    }
    const ID_ALIASES = {
      'prod-cow-ghee-havan-cups': 'prod-havan-cups',
      'prod-loban-dhoop': 'prod-charcoal-dhoop',
      'prod-kannauj-attar': 'prod-kannauj-gulab-attar',
      'prod-gangajal-brass-lota': 'prod-solid-brass-diya',
    };
    const lookupId = ID_ALIASES[productId] || productId;
    const cart = this.getCart(identifier);
    const state = loadState();
    const product = state.products.find((p) => p.id === lookupId || p.slug === lookupId || p.id === productId);
    if (!product) throw new Error('Product not found');

    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    if (!variant) throw new Error('Variant not found');

    if (variant.stockQuantity < quantity) {
      throw new Error(`Only ${variant.stockQuantity} items available in stock`);
    }

    const existingIndex = cart.items.findIndex((item) => item.variantId === variantId);
    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (variant.stockQuantity < newQty) {
        throw new Error(`Maximum available stock reached (${variant.stockQuantity})`);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        id: 'item-' + Math.random().toString(36).substring(2, 9),
        cartId: cart.id,
        productId,
        product,
        variantId,
        variant,
        quantity,
        isGiftItem: false,
      });
    }

    cart.updatedAt = new Date().toISOString();
    this.reconcileAutomaticOffers(cart);
    saveState();
    return cart;
  },

  updateCartItemQty(cartId, itemId, quantity) {
    const state = loadState();
    const cart = state.carts.find((c) => c.id === cartId);
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Cart item not found');

    if (item.isGiftItem) {
      throw new Error('Promotional gift item quantity cannot be adjusted manually');
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      const variant = item.variant;
      if (variant.stockQuantity < quantity) {
        throw new Error(`Only ${variant.stockQuantity} items in stock`);
      }
      item.quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();
    this.reconcileAutomaticOffers(cart);
    saveState();
    return cart;
  },

  removeCartItem(cartId, itemId) {
    return this.updateCartItemQty(cartId, itemId, 0);
  },

  applyCoupon(cartId, code) {
    const state = loadState();
    const cart = state.carts.find((c) => c.id === cartId);
    if (!cart) throw new Error('Cart not found');

    const coupon = state.coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive
    );
    if (!coupon) throw new Error('Invalid or expired coupon code');

    const totals = this.calculateCartTotals(cart);
    if (totals.subtotal < coupon.minCartValue) {
      throw new Error(`Minimum order value of ₹${coupon.minCartValue} required for this coupon`);
    }

    cart.appliedCoupon = coupon.code;
    cart.updatedAt = new Date().toISOString();
    saveState();

    const newTotals = this.calculateCartTotals(cart);
    return {
      cart,
      discount: newTotals.discountTotal,
      message: `Coupon ${coupon.code} applied successfully!`,
    };
  },

  removeCoupon(cartId) {
    const state = loadState();
    const cart = state.carts.find((c) => c.id === cartId);
    if (!cart) throw new Error('Cart not found');

    cart.appliedCoupon = undefined;
    cart.updatedAt = new Date().toISOString();
    saveState();
    return cart;
  },

  reconcileAutomaticOffers(cart) {
    const state = loadState();
    const qualifyingSubtotal = cart.items
      .filter((i) => !i.isGiftItem)
      .reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

    const activeOffer = state.automaticOffers
      .filter((o) => o.isActive && qualifyingSubtotal >= o.minOrderValue)
      .sort((a, b) => b.minOrderValue - a.minOrderValue)[0];

    // Remove old gift items
    cart.items = cart.items.filter((i) => !i.isGiftItem);

    // If eligible, inject gift item
    if (activeOffer) {
      for (const prod of state.products) {
        const giftVariant = prod.variants.find((v) => v.id === activeOffer.giftVariantId);
        if (giftVariant) {
          cart.items.push({
            id: 'gift-' + activeOffer.id,
            cartId: cart.id,
            productId: prod.id,
            product: prod,
            variantId: giftVariant.id,
            variant: { ...giftVariant, price: 0 },
            quantity: 1,
            isGiftItem: true,
          });
          break;
        }
      }
    }
  },

  calculateCartTotals(cart) {
    const state = loadState();
    const subtotal = cart.items
      .filter((i) => !i.isGiftItem)
      .reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

    let discountTotal = 0;
    if (cart.appliedCoupon) {
      const coupon = state.coupons.find(
        (c) => c.code.toUpperCase() === cart.appliedCoupon?.toUpperCase() && c.isActive
      );
      if (coupon && subtotal >= coupon.minCartValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountTotal = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount && discountTotal > coupon.maxDiscount) {
            discountTotal = coupon.maxDiscount;
          }
        } else if (coupon.discountType === 'FIXED_AMOUNT') {
          discountTotal = Math.min(coupon.value, subtotal);
        }
      }
    }

    const freeShippingThreshold = Number(state.settings.FREE_SHIPPING_THRESHOLD || '499');
    const flatFee = Number(state.settings.FLAT_SHIPPING_FEE || '50');
    const netForShipping = subtotal - discountTotal;
    const shippingTotal = netForShipping >= freeShippingThreshold || subtotal === 0 ? 0 : flatFee;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - netForShipping);

    const taxTotal = 0;
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingTotal);

    return {
      subtotal,
      discountTotal,
      shippingTotal,
      taxTotal,
      grandTotal,
      freeShippingThreshold,
      amountNeededForFreeShipping,
    };
  },

  // --- Orders & Atomic Checkout ---
  createOrder(payload) {
    const state = loadState();
    const cart = state.carts.find((c) => c.id === payload.cartId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cannot create order with an empty cart');
    }

    // Check idempotency
    const existing = state.orders.find((o) => o.idempotencyKey === payload.idempotencyKey);
    if (existing) return existing;

    // Verify stock
    for (const item of cart.items) {
      if (item.isGiftItem) continue;
      const product = state.products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!variant || variant.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${item.product.title} - ${item.variant.title}". Please adjust your cart.`
        );
      }
    }

    // Decrement inventory atomically
    for (const item of cart.items) {
      if (item.isGiftItem) continue;
      const product = state.products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (variant) {
        variant.stockQuantity -= item.quantity;
      }
    }

    const totals = this.calculateCartTotals(cart);
    state.orderCounter += 1;
    const orderNumber = `VP-${state.orderCounter}`;

    const newOrder = {
      id: 'order-' + Math.random().toString(36).substring(2, 10),
      orderNumber,
      userId: payload.userId,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone,
      status: 'PAID',
      currency: 'INR',
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      shippingTotal: totals.shippingTotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      couponCode: cart.appliedCoupon,
      idempotencyKey: payload.idempotencyKey,
      shippingAddress: payload.shippingAddress,
      billingAddress: payload.billingAddress,
      customerNotes: payload.customerNotes,
      shippingCourier: 'Delhivery Express',
      trackingNumber: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
      trackingUrl: 'https://www.delhivery.com/track/package/',
      items: cart.items.map((i) => ({
        id: 'ord-item-' + Math.random().toString(36).substring(2, 9),
        orderId: '',
        variantId: i.variantId,
        productTitle: i.product.title,
        variantTitle: i.variant.title,
        sku: i.variant.sku,
        imageUrl: i.product.images[0]?.url,
        unitPrice: i.isGiftItem ? 0 : i.variant.price,
        quantity: i.quantity,
        totalPrice: i.isGiftItem ? 0 : i.variant.price * i.quantity,
        isGift: i.isGiftItem,
      })),
      payments: [
        {
          id: 'pay-' + Math.random().toString(36).substring(2, 9),
          orderId: '',
          provider: 'RAZORPAY',
          providerOrderId: 'order_rzp_' + Math.random().toString(36).substring(2, 10),
          providerPaymentId: 'pay_rzp_' + Math.random().toString(36).substring(2, 10),
          amount: totals.grandTotal,
          currency: 'INR',
          status: 'CAPTURED',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newOrder.items.forEach((item) => (item.orderId = newOrder.id));
    newOrder.payments.forEach((payment) => (payment.orderId = newOrder.id));

    state.orders.unshift(newOrder);

    cart.items = [];
    cart.appliedCoupon = undefined;
    cart.updatedAt = new Date().toISOString();

    state.auditLogs.unshift({
      id: 'audit-' + Math.random().toString(36).substring(2, 9),
      userId: payload.userId,
      action: 'ORDER_PLACED',
      entityType: 'ORDER',
      entityId: newOrder.id,
      metadata: { orderNumber, grandTotal: totals.grandTotal },
      createdAt: new Date().toISOString(),
    });

    saveState();
    return newOrder;
  },

  getOrders(userId) {
    const state = loadState();
    if (userId) {
      return state.orders.filter((o) => o.userId === userId);
    }
    return state.orders;
  },

  getOrderByNumber(orderNumber) {
    return loadState().orders.find((o) => o.orderNumber === orderNumber);
  },

  getOrderById(id) {
    return loadState().orders.find((o) => o.id === id);
  },

  updateOrderStatus(orderId, status, courier, tracking) {
    const state = loadState();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    if (courier) order.shippingCourier = courier;
    if (tracking) {
      order.trackingNumber = tracking;
      order.trackingUrl = `https://www.delhivery.com/track/package/${tracking}`;
    }
    order.updatedAt = new Date().toISOString();

    state.auditLogs.unshift({
      id: 'audit-' + Math.random().toString(36).substring(2, 9),
      action: 'ORDER_STATUS_CHANGED',
      entityType: 'ORDER',
      entityId: order.id,
      metadata: { newStatus: status, courier, tracking },
      createdAt: new Date().toISOString(),
    });

    saveState();
    return order;
  },

  // --- Reviews ---
  getReviews() {
    return loadState().reviews.filter((r) => r.isApproved !== false);
  },
  getReviewsForProduct(productId) {
    return loadState().reviews.filter((r) => r.productId === productId && r.isApproved);
  },

  addReview(payload) {
    const state = loadState();
    const newReview = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      productId: payload.productId,
      userId: payload.userId,
      reviewerName: payload.reviewerName,
      rating: payload.rating,
      title: payload.title,
      body: payload.body,
      isVerified: true,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };
    state.reviews.unshift(newReview);

    const prod = state.products.find((p) => p.id === payload.productId);
    if (prod) {
      const prodReviews = state.reviews.filter((r) => r.productId === prod.id);
      prod.ratingCount = prodReviews.length;
      prod.ratingAverage = Number(
        (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
      );
    }

    saveState();
    return newReview;
  },

  // --- CMS & Sections ---
  getHomepageSections() {
    return loadState()
      .homepageSections.filter((s) => s.isEnabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  updateHomepageSection(id, updates) {
    const state = loadState();
    const section = state.homepageSections.find((s) => s.id === id);
    if (!section) throw new Error('Section not found');

    Object.assign(section, updates);
    saveState();
    return section;
  },

  // --- FAQs & Blogs ---
  getFAQs() {
    return loadState()
      .faqs.filter((f) => f.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getBlogs() {
    return loadState()
      .blogs.filter((b) => b.isPublished)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  getBlogBySlug(slug) {
    return loadState().blogs.find((b) => b.slug === slug);
  },

  // --- Inquiries & Newsletter ---
  addContactInquiry(inquiry) {
    const state = loadState();
    const item = {
      ...inquiry,
      id: 'inq-' + Math.random().toString(36).substring(2, 9),
      isResolved: false,
      createdAt: new Date().toISOString(),
    };
    state.contactInquiries.unshift(item);
    saveState();
    return item;
  },

  addWholesaleInquiry(inquiry) {
    const state = loadState();
    const item = {
      ...inquiry,
      id: 'ws-' + Math.random().toString(36).substring(2, 9),
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    state.wholesaleInquiries.unshift(item);
    saveState();
    return item;
  },

  addNewsletterSubscriber(email) {
    const state = loadState();
    const cleanEmail = email.toLowerCase().trim();
    const existing = state.newsletterSubscribers.find((s) => s.email === cleanEmail);
    if (existing) {
      return { success: true, message: 'You are already subscribed to our sacred circle!' };
    }

    state.newsletterSubscribers.unshift({
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      isSubscribed: true,
      createdAt: new Date().toISOString(),
    });
    saveState();
    return { success: true, message: 'Welcome to VedaPavitra! Check your email for your 15% welcome code.' };
  },

  // --- Redirects ---
  getRedirects() {
    return loadState().redirects.filter((r) => r.isActive);
  },

  addRedirect(rule) {
    const state = loadState();
    const newRule = {
      ...rule,
      id: 'red-' + Math.random().toString(36).substring(2, 9),
    };
    state.redirects.unshift(newRule);
    saveState();
    return newRule;
  },

  // --- Admin Metrics ---
  getAdminMetrics() {
    const state = loadState();
    const totalOrders = state.orders.length;
    const totalRevenue = state.orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const lowStockProducts = state.products
      .flatMap((p) => p.variants.map((v) => ({ productTitle: p.title, ...v })))
      .filter((v) => v.stockQuantity <= 10);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: aov,
      customersCount: state.users.filter((u) => u.role === 'CUSTOMER').length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      recentOrders: state.orders.slice(0, 6),
    };
  },

  getAuditLogs() {
    return loadState().auditLogs.slice(0, 50);
  },

  getSettings() {
    return loadState().settings;
  },

  updateSetting(key, value) {
    const state = loadState();
    state.settings[key] = value;
    saveState();
  },

  // --- Users & Authentication ---
  findUserByEmail(email) {
    if (!email) return null;
    return loadState().users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  },

  findUserById(id) {
    return loadState().users.find((u) => u.id === id);
  },

  createUser(userData) {
    const state = loadState();
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
    );
    if (existing) {
      throw new Error('A sacred account with this email address already exists');
    }

    const newUser = {
      id: 'user-' + Math.random().toString(36).substring(2, 10),
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      role: userData.role || 'CUSTOMER',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.users.push(newUser);
    saveState();
    return newUser;
  },

  // --- Admin Catalog Management ---
  getAllProductsAdmin() {
    return loadState().products;
  },

  createProduct(data) {
    const state = loadState();
    const newProduct = {
      ...data,
      id: 'prod-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.products.unshift(newProduct);
    saveState();
    return newProduct;
  },

  updateProduct(id, updates) {
    const state = loadState();
    const index = state.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    state.products[index] = {
      ...state.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveState();
    return state.products[index];
  },

  deleteProduct(id) {
    const state = loadState();
    state.products = state.products.filter((p) => p.id !== id);
    saveState();
    return { success: true };
  },

  // --- Coupons Management ---
  getCoupons() {
    return loadState().coupons;
  },

  createCoupon(data) {
    const state = loadState();
    const newCoupon = {
      ...data,
      id: 'cpn-' + Math.random().toString(36).substring(2, 8),
      code: data.code.toUpperCase().trim(),
      createdAt: new Date().toISOString(),
    };
    state.coupons.unshift(newCoupon);
    saveState();
    return newCoupon;
  },

  updateCoupon(id, updates) {
    const state = loadState();
    const index = state.coupons.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Coupon not found');

    state.coupons[index] = {
      ...state.coupons[index],
      ...updates,
    };
    saveState();
    return state.coupons[index];
  },

  deleteCoupon(id) {
    const state = loadState();
    state.coupons = state.coupons.filter((c) => c.id !== id);
    saveState();
    return { success: true };
  },

  // --- Automatic Offers Management ---
  getAutomaticOffers() {
    return loadState().automaticOffers;
  },

  updateAutomaticOffers(offers) {
    const state = loadState();
    state.automaticOffers = offers;
    saveState();
    return state.automaticOffers;
  },

  // --- Collections Management ---
  getAllCollectionsAdmin() {
    return loadState().collections;
  },

  createCollection(data) {
    const state = loadState();
    const newCollection = {
      ...data,
      id: 'col-' + Math.random().toString(36).substring(2, 9),
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isActive: true,
    };
    state.collections.push(newCollection);
    saveState();
    return newCollection;
  },

  updateCollection(id, updates) {
    const state = loadState();
    const col = state.collections.find((c) => c.id === id);
    if (!col) throw new Error('Collection not found');
    Object.assign(col, updates);
    saveState();
    return col;
  },

  deleteCollection(id) {
    const state = loadState();
    state.collections = state.collections.filter((c) => c.id !== id);
    saveState();
    return { success: true };
  },

  // --- Payments Audit ---
  getAllPaymentsAdmin() {
    const state = loadState();
    return state.orders.flatMap((order) =>
      (order.payments || []).map((pay) => ({
        ...pay,
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress?.fullName || 'Guest Customer',
        customerEmail: order.guestEmail || '',
        orderStatus: order.status,
      }))
    );
  },

  // --- Banners & CMS Customization ---
  getBannersAdmin() {
    const state = loadState();
    const heroSection = state.homepageSections.find((s) => s.type === 'HERO_SLIDER');
    const promoSection = state.homepageSections.find((s) => s.type === 'PROMO_BANNER');
    const seasonalSection = state.homepageSections.find((s) => s.type === 'SEASONAL_BANNER');
    return {
      slides: heroSection?.content?.slides || [],
      promoBanner: promoSection?.content || null,
      seasonalBanners: seasonalSection?.content?.banners || [
        {
          id: 'sb-navratri-special',
          badge: 'AUSPICIOUS MAHOTSAV OFFER',
          heading: 'Devi Pujan Samagri & Akhand Jyot Collection',
          subheading: 'Pure Cow Ghee Diyas, Kashmiri Kesar Chandan & 100% Bamboo-Free Fragrances for Divine Sanctity.',
          ctaText: 'Explore Festival Offer',
          ctaLink: '/collections/curated-puja-combos',
          imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1920&q=80',
          isActive: true,
          sortOrder: 0,
        },
      ],
      diyaShowcase: state.diyaShowcase || {
        id: 'diya_showcase',
        isActive: true,
        badge: '100% Panchaloha Brass • Temple Grade',
        title: 'Solid Handcrafted Brass Akhand Diya',
        price: 499,
        originalPrice: 799,
        discountText: '37% OFF',
        taxNote: 'Inclusive of all taxes',
        description: 'Cast in heavy temple brass by traditional artisans. Features hand-carved lotus petal engraving, a deep oil reservoir for uninterrupted all-day lighting, and a balanced weighted pedestal. Consecrated for daily grah shuddhi and auspicious deepam puja.',
        highlights: [
          'Heavy Brass (240g)',
          'Deep 8-Hour Reservoir',
          'Zero Carbon Emissions',
          'Traditional Baati Spout',
        ],
        ctaText: 'Bring Akhand Diya Home — ₹499',
        productId: 'prod-solid-brass-diya',
        variantId: 'var-bd-01',
        showTempleBell: true,
        bellTooltip: 'Click to ring sacred temple bell (घण्टा नाद)',
      },
      settings: state.settings || {},
    };
  },

  updateBannersAdmin({ slides, promoBanner, seasonalBanners, diyaShowcase }) {
    const state = loadState();
    if (slides) {
      const heroSection = state.homepageSections.find((s) => s.type === 'HERO_SLIDER');
      if (heroSection) heroSection.content.slides = slides;
    }
    if (promoBanner) {
      const promoSection = state.homepageSections.find((s) => s.type === 'PROMO_BANNER');
      if (promoSection) promoSection.content = promoBanner;
    }
    if (seasonalBanners) {
      let seasonalSection = state.homepageSections.find((s) => s.type === 'SEASONAL_BANNER');
      if (!seasonalSection) {
        seasonalSection = { id: 'sec-seasonal', type: 'SEASONAL_BANNER', content: { banners: [] } };
        state.homepageSections.push(seasonalSection);
      }
      seasonalSection.content.banners = seasonalBanners;
    }
    if (diyaShowcase) {
      state.diyaShowcase = { ...state.diyaShowcase, ...diyaShowcase };
    }
    saveState();
    return this.getBannersAdmin();
  },

  getDiyaShowcaseAdmin() {
    const state = loadState();
    return state.diyaShowcase || {
      id: 'diya_showcase',
      isActive: true,
      badge: '100% Panchaloha Brass • Temple Grade',
      title: 'Solid Handcrafted Brass Akhand Diya',
      price: 499,
      originalPrice: 799,
      discountText: '37% OFF',
      taxNote: 'Inclusive of all taxes',
      description: 'Cast in heavy temple brass by traditional artisans. Features hand-carved lotus petal engraving, a deep oil reservoir for uninterrupted all-day lighting, and a balanced weighted pedestal. Consecrated for daily grah shuddhi and auspicious deepam puja.',
      highlights: [
        'Heavy Brass (240g)',
        'Deep 8-Hour Reservoir',
        'Zero Carbon Emissions',
        'Traditional Baati Spout',
      ],
      ctaText: 'Bring Akhand Diya Home — ₹499',
      productId: 'prod-solid-brass-diya',
      variantId: 'var-bd-01',
      showTempleBell: true,
      bellTooltip: 'Click to ring sacred temple bell (घण्टा नाद)',
    };
  },

  updateDiyaShowcaseAdmin(updates) {
    const state = loadState();
    state.diyaShowcase = { ...(state.diyaShowcase || this.getDiyaShowcaseAdmin()), ...updates };
    saveState();
    return state.diyaShowcase;
  },
};
