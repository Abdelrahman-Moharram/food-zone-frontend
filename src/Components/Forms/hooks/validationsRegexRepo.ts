// ✅ Patterns
export const phoneNumberPattern      = "^(?:\+20|0020|0)(1[0125][0-9]{8})$";
export const amountPattern           = "^[0-9.]+$";

export const usernamePattern         = "^[a-zA-Z][a-zA-Z0-9_.-]{2,}$";
export const fullNamePattern         = "^([ء-ي][ء-ي ]{4,}|[a-zA-Z][a-zA-Z ]{4,})$";
export const emailPattern            = "^[a-z][a-z0-9-_\\.]+@[a-z.]+\\.[a-z]{2,3}$";


export const phoneNumberRegex = {
  value: phoneNumberPattern,
  message: "Phone number must start with (05, +966, or 966) and contain 8 digits",
  message_ar: "رقم الهاتف يجب أن يبدأ بـ (05 أو +966 أو 966) ويحتوي على 8 أرقام"
};





export const amountRegex = {
  value: amountPattern,
  message: "Amount must be a valid number",
  message_ar: "المبلغ يجب أن يكون رقمًا صحيحًا"
};

export const usernameRegex = {
  value: usernamePattern,
  message: "Username must start with a letter, be at least 3 characters, and not include [+%$#/|\\!]",
  message_ar: "اسم المستخدم يجب أن يبدأ بأحرف ويحتوي على 3 أحرف على الأقل ولا يحتوي على [+%$#/|\\!]"
};

export const fullNameRegex = {
  value: fullNamePattern,
  message: "Full name must be at least 5 letters and contain no digits",
  message_ar: "الاسم الكامل يجب أن يتكون من 5 أحرف على الأقل ولا يحتوي على أرقام"
};


export const emailRegex = {
  value: emailPattern,
  message: "Invalid email address",
  message_ar: "البريد الإلكتروني غير صحيح"
};

