export interface OrderStateDef {
    id: string;
    name: string;
    variant: string;
    order: number;
    default: boolean;
}

export interface MealSize {
    id: string;
    name: string;
    price: number;
}

export interface MealDetail {
    id: string;
    name: string;
    description: string;
}

export interface OrderMeal {
    id: number;
    size: MealSize;
    count: number;
    comment: string;
    meal: MealDetail;
}

export interface OrderData {
    id: string;
    code: string;
    state: string | OrderStateDef;
    branch: string;
    payment_method: string;
    created_by: string;
    created_at: string;
    meals: OrderMeal[];
}

export interface BoardColumnData {
    state   : OrderStateDef;
    orders  : OrderData[];
    cols    : string
}
