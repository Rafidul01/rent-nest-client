// app/_lib/types.ts

export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";

export interface UserData {
    success: boolean;
    statusCode: number;
    message: string;
    data: User;

}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: Role;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    areaSqft?: number | null;
    amenities: string[];
    images: string[];
    isAvailable: boolean;
    landlordId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;

    // present when the API includes relations
    category?: Category;
    landlord?: Pick<User, "id" | "name" | "email" | "phone">;
}

export interface RentalRequest {
    id: string;
    moveInDate: string;
    durationMonths: number;
    message?: string | null;
    status: RentalStatus;
    totalAmount: number;
    tenantId: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;

    property?: Property;
    tenant?: Pick<User, "id" | "name" | "email" | "phone">;
    payment?: Payment | null;
    review?: Review | null;
}

export interface Payment {
    id: string;
    transactionId: string;
    amount: number;
    method: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    stripeSessionId?: string | null;
    stripePaymentIntentId?: string | null;
    paidAt?: string | null;
    rentalRequestId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    rentalRequest?: RentalRequest;
}

export interface Review {
    id: string;
    rating: number;
    comment?: string | null;
    rentalRequestId: string;
    propertyId: string;
    tenantId: string;
    createdAt: string;

    tenant?: Pick<User, "id" | "name">;
}

// Generic API response shapes matching your backend's structured format
export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
    };
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errorDetails: unknown;
}