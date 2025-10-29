import { supabase } from './supabase';

// Type definitions
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserProfile {
  userId: string;
  walletAddress?: string;
  name: string;
  phone: string;
  email?: string;
  bloodType?: string;
  photo?: string;
  emergencyContacts: EmergencyContact[];
  medicalInfo?: string;
  digitalId: string;
  qrCode?: string;
  createdAt?: Date;
  lastActive?: Date;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface EmergencyAlert {
  alertId: string;
  userId: string;
  userName: string;
  userPhone: string;
  timestamp: Date;
  location: Location;
  type: 'manual_police' | 'manual_ambulance' | 'shake_sos' | 'stealth';
  status: 'pending' | 'verified' | 'dispatched' | 'resolved' | 'false_alarm';
  policeNotified: boolean;
  ambulanceNotified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface EFIRReport {
  firId: string;
  userId: string;
  title: string;
  description: string;
  incidentDate: Date;
  location: Location;
  evidence: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt?: Date;
}

export interface NFTReward {
  nftId: string;
  userId: string;
  type: 'helper' | 'reporter' | 'active_citizen';
  metadata: Record<string, any>;
  minted: boolean;
  createdAt?: Date;
}

export class DatabaseService {
  // Digital ID generator
  static generateDigitalId(): string {
    const prefix = 'AEGIS';
    const random1 = Math.random().toString(36).substring(2, 5).toUpperCase();
    const random2 = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${random1}-${random2}`;
  }

  // User Profile Methods
  static async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'lastActive'>): Promise<string> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        user_id: profile.userId,
        wallet_address: profile.walletAddress || null,
        name: profile.name,
        phone: profile.phone,
        email: profile.email || null,
        blood_type: profile.bloodType || null,
        photo: profile.photo || null,
        emergency_contacts: profile.emergencyContacts,
        medical_info: profile.medicalInfo || null,
        digital_id: profile.digitalId,
        qr_code: profile.qrCode || null,
        last_active: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data.user_id;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return {
      userId: data.user_id,
      walletAddress: data.wallet_address || undefined,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      bloodType: data.blood_type || undefined,
      photo: data.photo || undefined,
      emergencyContacts: data.emergency_contacts || [],
      medicalInfo: data.medical_info || undefined,
      digitalId: data.digital_id,
      qrCode: data.qr_code || undefined,
      createdAt: new Date(data.created_at),
      lastActive: new Date(data.last_active),
    };
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        wallet_address: updates.walletAddress || null,
        name: updates.name,
        phone: updates.phone,
        email: updates.email || null,
        blood_type: updates.bloodType || null,
        photo: updates.photo || null,
        emergency_contacts: updates.emergencyContacts,
        medical_info: updates.medicalInfo || null,
        qr_code: updates.qrCode || null,
        last_active: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Emergency Alert Methods
  static async createEmergencyAlert(alert: Omit<EmergencyAlert, 'alertId'>): Promise<string> {
    const alertId = `ALERT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    const { error } = await supabase
      .from('emergencies')
      .insert({
        alert_id: alertId,
        user_id: alert.userId,
        user_name: alert.userName,
        user_phone: alert.userPhone,
        timestamp: alert.timestamp.toISOString(),
        location: alert.location,
        type: alert.type,
        status: alert.status,
        police_notified: alert.policeNotified,
        ambulance_notified: alert.ambulanceNotified,
        verified_by: alert.verifiedBy || null,
        verified_at: alert.verifiedAt?.toISOString() || null,
      });

    if (error) throw error;
    return alertId;
  }

  static async getEmergencyAlert(alertId: string): Promise<EmergencyAlert | null> {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .eq('alert_id', alertId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      alertId: data.alert_id,
      userId: data.user_id,
      userName: data.user_name,
      userPhone: data.user_phone,
      timestamp: new Date(data.timestamp),
      location: data.location,
      type: data.type,
      status: data.status,
      policeNotified: data.police_notified,
      ambulanceNotified: data.ambulance_notified,
      verifiedBy: data.verified_by || undefined,
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
    };
  }

  static async getPendingEmergencies(): Promise<EmergencyAlert[]> {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .eq('status', 'pending')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return (data || []).map(d => ({
      alertId: d.alert_id,
      userId: d.user_id,
      userName: d.user_name,
      userPhone: d.user_phone,
      timestamp: new Date(d.timestamp),
      location: d.location,
      type: d.type,
      status: d.status,
      policeNotified: d.police_notified,
      ambulanceNotified: d.ambulance_notified,
      verifiedBy: d.verified_by || undefined,
      verifiedAt: d.verified_at ? new Date(d.verified_at) : undefined,
    }));
  }

  static async updateEmergencyAlert(alertId: string, updates: Partial<EmergencyAlert>): Promise<void> {
    const updateData: any = {};
    
    if (updates.status) updateData.status = updates.status;
    if (updates.policeNotified !== undefined) updateData.police_notified = updates.policeNotified;
    if (updates.ambulanceNotified !== undefined) updateData.ambulance_notified = updates.ambulanceNotified;
    if (updates.verifiedBy) updateData.verified_by = updates.verifiedBy;
    if (updates.verifiedAt) updateData.verified_at = updates.verifiedAt.toISOString();

    const { error } = await supabase
      .from('emergencies')
      .update(updateData)
      .eq('alert_id', alertId);

    if (error) throw error;
  }

  // E-FIR Methods
  static async createEFIR(efir: Omit<EFIRReport, 'firId' | 'createdAt'>): Promise<string> {
    const firId = `FIR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    const { error } = await supabase
      .from('efirs')
      .insert({
        fir_id: firId,
        user_id: efir.userId,
        title: efir.title,
        description: efir.description,
        incident_date: efir.incidentDate.toISOString(),
        location: efir.location,
        evidence: efir.evidence,
        status: efir.status,
      });

    if (error) throw error;
    return firId;
  }

  static async getEFIR(firId: string): Promise<EFIRReport | null> {
    const { data, error } = await supabase
      .from('efirs')
      .select('*')
      .eq('fir_id', firId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      firId: data.fir_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      incidentDate: new Date(data.incident_date),
      location: data.location,
      evidence: data.evidence || [],
      status: data.status,
      createdAt: new Date(data.created_at),
    };
  }

  // NFT Methods
  static async createNFTReward(nft: Omit<NFTReward, 'nftId' | 'createdAt'>): Promise<string> {
    const nftId = `NFT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    const { error } = await supabase
      .from('nfts')
      .insert({
        nft_id: nftId,
        user_id: nft.userId,
        type: nft.type,
        metadata: nft.metadata,
        minted: nft.minted,
      });

    if (error) throw error;
    return nftId;
  }

  static async getUserNFTs(userId: string): Promise<NFTReward[]> {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(d => ({
      nftId: d.nft_id,
      userId: d.user_id,
      type: d.type,
      metadata: d.metadata || {},
      minted: d.minted,
      createdAt: new Date(d.created_at),
    }));
  }
}
