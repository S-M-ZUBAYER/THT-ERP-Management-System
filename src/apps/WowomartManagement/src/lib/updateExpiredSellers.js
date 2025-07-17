import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const checkExpiration = (paymentTime, duration) => {
  if (!paymentTime || !duration) return 0;
  const paymentDate = dayjs(paymentTime);
  const months = parseInt(duration.split(" ")[0], 10);
  const expirationDate = paymentDate.add(months, "month");
  return expirationDate.isBefore(dayjs()) ? 0 : 1;
};

const updateExpiredSellers = async (createdAccounts) => {
  const expiredEmails = createdAccounts
    .filter(
      (seller) => checkExpiration(seller.paymentTime, seller.Duration) === 0
    )
    .map((seller) => seller.email);

  if (expiredEmails.length === 0) return;

  try {
    await axios.put(
      "https://grozziieget.zjweiting.com:8033/tht/multiVendorPaymentInfo/updateMultipleEmailSubscriptionStatus",
      { emails: expiredEmails }
    );
    //   const subject = "Your Account was expired";
    //   const message = "Your Account was expired\nPlease buy another package";
    //   await Promise.all(
    //     expiredEmails.map((email) => handleToEmail(email, subject, message))
    //   );
    console.log("Expired sellers updated and notified:", expiredEmails);
  } catch (error) {
    console.error("Error updating sellers:", error);
    toast.error("Failed to update sellers.");
  }
};

export default updateExpiredSellers;
