/**
 * Report interfaces aligned with backend API shape
 */
export interface ReportComment {
    _id?: string;
    text: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    createdAt?: string;
}

export interface StatusHistoryItem {
    status: string;
    changedBy: { _id: string; name?: string };
    changedAt: string;
    comment?: string;
}

export interface ReportLocation {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    address?: string;
    city?: string;
}

export interface Report {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: 'OUVERT' | 'EN_COURS' | 'RESOLU' | 'REJETE' | string;
    priority?: string;
    imageUrl?: string;
    imagePublicId?: string;
    resolutionImageUrl?: string;
    resolutionImagePublicId?: string;
    location: ReportLocation;
    createdBy: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    comments?: ReportComment[];
    upvotes?: number;
    statusHistory?: StatusHistoryItem[];
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

export interface CreateReportData {
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    imageFile?: File; // Image to upload
    priority?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message?: string;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
    data: T;
}

export interface ReportStatsResponse {
    success: boolean;
    data: {
        total: number;
        byStatus: Array<{ _id: string; count: number }>;
        byCategory: Array<{ _id: string; count: number }>;
        recentReports: Report[];
    };
}
