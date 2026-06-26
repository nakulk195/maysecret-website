import { supabase } from '../lib/supabase';
import { IthinkService } from './ithinkService';

export interface ShipmentSummary {
  awb_number?: string | null;
  shipment_id?: string | null;
  courier_name?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  shipment_status?: string | null;
  shipping_label_url?: string | null;
  invoice_url?: string | null;
  shipment_created_at?: string | null;
}

export class ShipmentService {
  static async createShipmentForOrder(orderId: string) {
    return IthinkService.createShipment(orderId);
  }

  static async createShipmentForOrderSafely(orderId: string) {
    return IthinkService.createShipmentWithoutBlockingOrder(orderId);
  }

  static async refreshTracking(orderId: string) {
    return IthinkService.trackOrder(orderId);
  }

  static async getAdminOrders() {
    return IthinkService.getAdminOrders();
  }

  static async getOrderShipment(orderId: string): Promise<ShipmentSummary | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        awb_number,
        shipment_id,
        courier_name,
        tracking_number,
        tracking_url,
        shipment_status,
        shipping_label_url,
        invoice_url,
        shipment_created_at
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

export const shipmentService = ShipmentService;

