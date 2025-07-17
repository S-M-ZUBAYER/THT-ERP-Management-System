import emailjs from "@emailjs/browser";

const EMAILJS_PUBLIC_KEY = "BdhgJg9oyaR8HBBNx";
const EMAILJS_SERVICE_ID = "service_7rnps2c";
const EMAILJS_TEMPLATE_ID = "template_wt3urfs";

const handleToEmail = async (email, subject, message) => {
  console.log("Click to send email");

  const templateParams = {
    to_email: email || "thtspace9@gmail.com",
    from_name: "THT Team",
    reply_to: "smzubayer9004@gmail.com",
    subject: subject || "MultiVendor Subscription",
    message:
      message ||
      "Your account has been created. Email: thtspace6@gmail.com, Password: 123456",
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log("Email sent successfully:", response);
    return { status: "success", data: response };
  } catch (error) {
    console.error("Error sending email:", error);
    return { status: "error", data: error };
  }
};

export default handleToEmail;

export const messageTemplate = (email, password) => {
  const message = `Dear Seller,

Congratulations! We’ve successfully created your seller account. Below are your account details:

- **Email**: ${email}
- **Password**: ${password} 
- **Seller Login Link**: https://1f9df1-0f.sp-seller.webkul.com/index.php?p=login

Please use the above credentials to log in and start setting up your seller profile. For security, we recommend changing your password after your first login.

If you have any questions or need assistance, feel free to contact our support team at thtspace9@gmail.com.

Welcome aboard, and we’re excited to see your success on our platform!

Best regards,  
Wowomart  
wowomart.com`;
  return message;
};
