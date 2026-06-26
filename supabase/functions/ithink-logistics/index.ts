import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type JsonRecord = Record<string, any>;

const getEnv = (key: string, fallback = '') => Deno.env.get(key) || fallback;

const supabaseUrl = getEnv('SUPABASE_URL');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const ithinkAccessToken = getEnv('ITHINK_ACCESS_TOKEN');
const ithinkSecretKey = getEnv('ITHINK_SECRET_KEY');
const ithinkPickupAddressId = getEnv('ITHINK_PICKUP_ADDRESS_ID');
const ithinkReturnAddressId = getEnv('ITHINK_RETURN_ADDRESS_ID', ithinkPickupAddressId);
const ithinkLogistics = getEnv('ITHINK_LOGISTICS', '');
const ithinkServiceType = getEnv('ITHINK_SERVICE_TYPE', '');
const ithinkEnvironment = getEnv('ITHINK_ENVIRONMENT', 'staging').toLowerCase();
const ithinkBaseUrl = getEnv(
  'ITHINK_API_BASE_URL',
  ithinkEnvironment === 'production'
    ? 'https://my.ithinklogistics.com/api_v3'
    : 'https://pre-alpha.ithinklogistics.com/api_v3'
);
const ithinkTrackBaseUrl = getEnv(
  'ITHINK_TRACK_API_BASE_URL',
  ithinkEnvironment === 'production'
    ? 'https://api.ithinklogistics.com/api_v3'
    : 'https://pre-alpha.ithinklogistics.com/api_v3'
);
const adminEmails = getEnv('ITHINK_ADMIN_EMAILS')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const jsonResponse = (body: JsonRecord, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const compact = (value: unknown) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const toNumberString = (value: unknown, fallback = '0') => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? String(numberValue) : fallback;
};

const parseAddress = (order: JsonRecord) => {
  if (order.shipping_address && typeof order.shipping_address === 'object') return order.shipping_address;
  if (!order.address) return {};
  if (typeof order.address === 'object') return order.address;

  try {
    return JSON.parse(order.address);
  } catch {
    return { address_line_1: order.address };
  }
};

const customerName = (address: JsonRecord, user: JsonRecord | null) =>
  compact(address.fullName || address.full_name || address.name || user?.email || 'Customer');

const customerPhone = (address: JsonRecord) =>
  compact(address.mobileNumber || address.phone || address.billing_phone).replace(/\D/g, '');

const addressLine1 = (address: JsonRecord) =>
  compact(address.houseNo || address.address_line_1 || address.street || address.add || 'Address');

const addressLine2 = (address: JsonRecord) =>
  [address.apartment, address.area, address.address_line_2, address.landmark]
    .map(compact)
    .filter(Boolean)
    .join(', ');

const paymentMode = (order: JsonRecord) =>
  compact(order.payment_method).toLowerCase() === 'cod' ? 'COD' : 'Prepaid';

const formatOrderDate = (createdAt?: string) => {
  const date = createdAt ? new Date(createdAt) : new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const buildShipmentPayload = (order: JsonRecord, authUser: JsonRecord | null) => {
  const address = parseAddress(order);
  const items = Array.isArray(order.order_items) ? order.order_items : [];
  const totalAmount = Number(order.total_amount || 0);
  const name = customerName(address, authUser);
  const phone = customerPhone(address);
  const email = compact(address.emailAddress || address.email || authUser?.email);
  const line1 = addressLine1(address);
  const line2 = addressLine2(address);
  const pincode = compact(address.pincode || address.pin);
  const city = compact(address.city);
  const state = compact(address.state);
  const country = compact(address.country || 'India');
  const mode = paymentMode(order);

  const products = items.length
    ? items.slice(0, 40).map((item: JsonRecord) => ({
        product_name: compact(item.product_name || item.products?.name || 'Product'),
        product_sku: compact(item.product_id || item.product_number || ''),
        product_quantity: toNumberString(item.quantity, '1'),
        product_price: toNumberString(item.product_price || item.price, '0'),
        product_tax_rate: getEnv('ITHINK_DEFAULT_TAX_RATE', '0'),
        product_hsn_code: getEnv('ITHINK_DEFAULT_HSN_CODE', ''),
        product_discount: '0',
        product_img_url: compact(item.product_image || item.products?.image || ''),
      }))
    : [{
        product_name: 'May Secret Product',
        product_sku: compact(order.id),
        product_quantity: '1',
        product_price: toNumberString(totalAmount, '0'),
        product_tax_rate: getEnv('ITHINK_DEFAULT_TAX_RATE', '0'),
        product_hsn_code: getEnv('ITHINK_DEFAULT_HSN_CODE', ''),
        product_discount: '0',
        product_img_url: '',
      }];

  const shipment = {
    waybill: '',
    order: compact(order.order_number || order.id),
    sub_order: '',
    order_date: formatOrderDate(order.created_at),
    total_amount: toNumberString(totalAmount, '0'),
    name,
    company_name: '',
    add: line1,
    add2: line2,
    add3: '',
    pin: pincode,
    city,
    state,
    country,
    phone,
    alt_phone: '',
    email,
    is_billing_same_as_shipping: 'yes',
    billing_name: name,
    billing_company_name: '',
    billing_add: line1,
    billing_add2: line2,
    billing_add3: '',
    billing_pin: pincode,
    billing_city: city,
    billing_state: state,
    billing_country: country,
    billing_phone: phone,
    billing_alt_phone: '',
    billing_email: email,
    products,
    shipment_length: getEnv('ITHINK_DEFAULT_LENGTH_CM', '10'),
    shipment_width: getEnv('ITHINK_DEFAULT_WIDTH_CM', '10'),
    shipment_height: getEnv('ITHINK_DEFAULT_HEIGHT_CM', '5'),
    weight: getEnv('ITHINK_DEFAULT_WEIGHT', '0.5'),
    shipping_charges: '0',
    giftwrap_charges: '0',
    transaction_charges: '0',
    total_discount: '0',
    first_attemp_discount: '0',
    cod_charges: '0',
    advance_amount: mode === 'COD' ? '0' : toNumberString(totalAmount, '0'),
    cod_amount: mode === 'COD' ? toNumberString(totalAmount, '0') : '0',
    payment_mode: mode,
    reseller_name: '',
    eway_bill_number: '',
    gst_number: '',
    what3words: '',
    return_address_id: ithinkReturnAddressId,
  };

  return {
    data: {
      shipments: [shipment],
      pickup_address_id: ithinkPickupAddressId,
      access_token: ithinkAccessToken,
      secret_key: ithinkSecretKey,
      logistics: ithinkLogistics,
      s_type: ithinkServiceType,
      order_type: '',
    },
  };
};

const assertIthinkConfig = () => {
  const missing = [
    ['ITHINK_ACCESS_TOKEN', ithinkAccessToken],
    ['ITHINK_SECRET_KEY', ithinkSecretKey],
    ['ITHINK_PICKUP_ADDRESS_ID', ithinkPickupAddressId],
    ['SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey],
  ].filter(([, value]) => !value);

  if (missing.length) {
    throw new Error(`Missing backend secret(s): ${missing.map(([key]) => key).join(', ')}`);
  }
};

const postToIthink = async (path: string, body: JsonRecord, operation: string) => {
  const baseUrl = operation === 'track' ? ithinkTrackBaseUrl : ithinkBaseUrl;
  const url = `${baseUrl}${path}`;
  let lastError: Error | null = null;
  let lastStatus = 0;
  let lastPayload: JsonRecord | null = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(body),
      });
      lastStatus = response.status;
      const text = await response.text();
      lastPayload = text ? JSON.parse(text) : {};

      if (response.ok && Number(lastPayload.status_code || response.status) < 500) {
        return { status: response.status, payload: lastPayload };
      }

      lastError = new Error(lastPayload.html_message || lastPayload.message || `iThink ${operation} failed`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < 3) {
      await delay(400 * attempt);
    }
  }

  const error = lastError || new Error(`iThink ${operation} failed`);
  (error as any).status = lastStatus;
  (error as any).payload = lastPayload;
  throw error;
};

const logApiCall = async (
  orderId: string | null,
  operation: string,
  success: boolean,
  details: JsonRecord,
) => {
  const { error } = await supabaseAdmin.from('shipment_api_logs').insert({
    order_id: orderId,
    provider: 'ithink',
    operation,
    success,
    status_code: details.statusCode || null,
    request_payload: details.requestPayload || null,
    response_payload: details.responsePayload || null,
    error_message: details.errorMessage || null,
  });

  if (error) {
    console.error('[ithink-logistics] Could not write shipment API log:', error.message);
  }
};

const normalizeCreateResponse = (payload: JsonRecord, order: JsonRecord) => {
  const first = payload?.data && typeof payload.data === 'object'
    ? Object.values(payload.data)[0] as JsonRecord | undefined
    : undefined;

  const awb = compact(first?.waybill || first?.awb_number || first?.awb_no);
  const courier = compact(first?.logistic_name || first?.logistic || first?.courier_name);
  const trackingUrl = compact(first?.tracking_url);
  const shipmentStatus = compact(first?.status || payload?.status || 'Created');

  return {
    awb_number: awb || null,
    shipment_id: compact(first?.shipment_id || first?.refnum || order.id) || null,
    courier_name: courier || null,
    tracking_number: awb || null,
    tracking_url: trackingUrl || null,
    shipment_status: shipmentStatus || null,
    shipment_created_at: new Date().toISOString(),
    ithink_shipment_response: payload,
    ithink_shipment_error: null,
  };
};

const getOrderForUser = async (orderId: string, authUser: JsonRecord) => {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (id, name, image, price)
      )
    `)
    .eq('id', orderId)
    .maybeSingle();

  if (error) throw error;
  if (!order) throw new Error('Order not found');

  const isAdmin = adminEmails.includes(String(authUser.email || '').toLowerCase());
  if (!isAdmin && order.user_id !== authUser.id) {
    throw new Error('Not allowed to access this order');
  }

  return order;
};

const createShipment = async (orderId: string, authUser: JsonRecord) => {
  assertIthinkConfig();
  const order = await getOrderForUser(orderId, authUser);

  if (order.awb_number) {
    return { success: true, order, message: 'Shipment already exists' };
  }

  const requestPayload = buildShipmentPayload(order, authUser);

  try {
    const { status, payload } = await postToIthink('/order/add.json', requestPayload, 'create');
    const shipmentFields = normalizeCreateResponse(payload, order);
    let shippingLabelUrl = null;
    let invoiceUrl = null;

    if (shipmentFields.awb_number) {
      const labelResult = await createDocumentUrl('/shipping/label.json', shipmentFields.awb_number, 'label', orderId);
      const invoiceResult = await createDocumentUrl('/shipping/invoice.json', shipmentFields.awb_number, 'invoice', orderId);
      shippingLabelUrl = labelResult || null;
      invoiceUrl = invoiceResult || null;
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        ...shipmentFields,
        shipping_label_url: shippingLabelUrl,
        invoice_url: invoiceUrl,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    await logApiCall(orderId, 'create_shipment', true, {
      statusCode: status,
      requestPayload,
      responsePayload: payload,
    });

    return { success: Boolean(shipmentFields.awb_number), order: updatedOrder, response: payload };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await supabaseAdmin
      .from('orders')
      .update({
        shipment_status: 'creation_failed',
        ithink_shipment_error: message,
      })
      .eq('id', orderId);

    await logApiCall(orderId, 'create_shipment', false, {
      statusCode: (error as any).status,
      requestPayload,
      responsePayload: (error as any).payload,
      errorMessage: message,
    });

    return { success: false, error: message };
  }
};

const createDocumentUrl = async (path: string, awbNumber: string, operation: string, orderId: string) => {
  const data: JsonRecord = {
    awb_numbers: awbNumber,
    access_token: ithinkAccessToken,
    secret_key: ithinkSecretKey,
  };

  if (operation === 'label') {
    data.page_size = getEnv('ITHINK_LABEL_PAGE_SIZE', 'A4');
    data.display_cod_prepaid = '';
    data.display_shipper_mobile = '';
    data.display_shipper_address = '';
  }

  const requestPayload = { data };

  try {
    const { status, payload } = await postToIthink(path, requestPayload, operation);
    await logApiCall(orderId, operation, true, {
      statusCode: status,
      requestPayload,
      responsePayload: payload,
    });
    return compact(payload.file_name);
  } catch (error) {
    await logApiCall(orderId, operation, false, {
      statusCode: (error as any).status,
      requestPayload,
      responsePayload: (error as any).payload,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return '';
  }
};

const trackOrder = async (orderId: string, authUser: JsonRecord) => {
  assertIthinkConfig();
  const order = await getOrderForUser(orderId, authUser);

  if (!order.awb_number) {
    return { success: false, error: 'No AWB number is available for this order yet' };
  }

  const requestPayload = {
    data: {
      awb_number_list: order.awb_number,
      access_token: ithinkAccessToken,
      secret_key: ithinkSecretKey,
    },
  };

  try {
    const { status, payload } = await postToIthink('/order/track.json', requestPayload, 'track');
    const details = payload?.data?.[order.awb_number] || {};
    const shipmentStatus = compact(details.current_status || order.shipment_status || 'Tracking updated');

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        courier_name: compact(details.logistic || order.courier_name) || order.courier_name,
        shipment_status: shipmentStatus,
        ithink_tracking_response: payload,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    await logApiCall(orderId, 'track_order', true, {
      statusCode: status,
      requestPayload,
      responsePayload: payload,
    });

    return { success: true, order: updatedOrder, response: payload };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logApiCall(orderId, 'track_order', false, {
      statusCode: (error as any).status,
      requestPayload,
      responsePayload: (error as any).payload,
      errorMessage: message,
    });
    return { success: false, error: message };
  }
};

const listAdminOrders = async (authUser: JsonRecord) => {
  const email = String(authUser.email || '').toLowerCase();
  if (!adminEmails.includes(email)) {
    throw new Error('Admin access is not configured for this account');
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        product_name,
        product_image,
        product_price
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return { success: true, orders: data || [] };
};

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405);
  }

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const body = await req.json();
    const action = body.action;

    if (action === 'create_shipment') {
      if (!body.orderId) return jsonResponse({ success: false, error: 'orderId is required' }, 400);
      return jsonResponse(await createShipment(body.orderId, userData.user));
    }

    if (action === 'track_order') {
      if (!body.orderId) return jsonResponse({ success: false, error: 'orderId is required' }, 400);
      return jsonResponse(await trackOrder(body.orderId, userData.user));
    }

    if (action === 'admin_orders') {
      return jsonResponse(await listAdminOrders(userData.user));
    }

    return jsonResponse({ success: false, error: 'Unknown action' }, 400);
  } catch (error) {
    console.error('[ithink-logistics] Request failed:', error);
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected logistics error',
    }, 500);
  }
});
