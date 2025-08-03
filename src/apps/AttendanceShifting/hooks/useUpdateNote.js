import { useTranslation } from "react-i18next";

const useUpdateNotes = (exitTime, calculateExitTime) => {
  const newNote = `Group 09 is for setting the shift change time, which is defaulted to midnight (00:00). If you clock in after 00:00, the entry will be recorded in the next day's column. However, if our latest off-duty time exceeds 00:00, we need to manually adjust the time for Group 09. For example, if you leave at ${exitTime} AM, you need to change Group 09 to at least ${calculateExitTime} AM (to avoid clocking in exactly at 2:00 AM, which would push the entry to the next day). Typically, we set this time at least 30 minutes later than the latest off-duty time.`;

  const { i18n } = useTranslation();
  i18n.addResource("en", "translation", "note", newNote);
  i18n.addResource(
    "id",
    "translation",
    "note",
    `Grup 09 digunakan untuk mengatur waktu pergantian shift, yang secara default disetel pada tengah malam (00:00). Jika Anda masuk setelah 00:00, entri akan dicatat di kolom hari berikutnya. Namun, jika waktu pulang terakhir kami melebihi 00:00, kami perlu menyesuaikan waktu Grup 09 secara manual. Misalnya, jika Anda pulang jam ${exitTime} pagi, Anda perlu mengubah Grup 09 menjadi setidaknya ${calculateExitTime} pagi (untuk menghindari pencatatan masuk pada pukul 2:00 yang akan memindahkan entri ke hari berikutnya). Biasanya, kami mengatur waktu ini setidaknya 30 menit setelah waktu pulang terakhir.`
  );
  i18n.addResource(
    "fil",
    "translation",
    "note",
    `Ang Group 09 ay ginagamit para sa pagtatakda ng oras ng pagpapalit ng shift, na default na naka-set sa hatingabi (00:00). Kung magtatrabaho ka pagkatapos ng 00:00, ang entry ay ilalagay sa column ng susunod na araw. Gayunpaman, kung ang huling oras ng pag-uwi natin ay lumampas sa 00:00, kailangan nating manu-manong ayusin ang oras para sa Group 09. Halimbawa, kung uuwi ka ng ${exitTime} AM, kailangan mong baguhin ang Group 09 sa hindi bababa sa ${calculateExitTime} AM (upang maiwasan ang pag-tap in ng eksaktong 2:00 AM na magtutulak sa entry sa susunod na araw). Karaniwan, itinatakda namin ang oras na ito ng hindi bababa sa 30 minuto pagkatapos ng huling oras ng pag-uwi.`
  );
  i18n.addResource(
    "ms",
    "translation",
    "note",
    `Grup 09 adalah untuk menetapkan masa pertukaran syif, yang secara lalai ditetapkan pada tengah malam (00:00). Jika anda mencatatkan waktu masuk selepas 00:00, rekod tersebut akan dimasukkan ke dalam lajur hari berikutnya. Walau bagaimanapun, jika waktu pulang paling lewat melebihi 00:00, kita perlu mengubah masa untuk Grup 09 secara manual. Sebagai contoh, jika anda pulang pada pukul ${exitTime} pagi, anda perlu mengubah Grup 09 ke sekurang-kurangnya ${calculateExitTime} pagi (untuk mengelakkan mencatatkan waktu masuk tepat pada 2:00 pagi yang akan mendorong rekod ke hari berikutnya). Biasanya, kami menetapkan masa ini sekurang-kurangnya 30 minit lebih lewat daripada waktu pulang paling lewat.`
  );
  i18n.addResource(
    "th",
    "translation",
    "note",
    `กลุ่ม 09 ใช้สำหรับการตั้งเวลาการเปลี่ยนกะ ซึ่งตั้งค่าเริ่มต้นที่เที่ยงคืน (00:00) หากคุณเข้างานหลังจาก 00:00 การบันทึกจะไปอยู่ในช่องของวันถัดไป แต่หากเวลาหมดงานล่าสุดของเราผ่าน 00:00 เราจำเป็นต้องปรับเวลาในกลุ่ม 09 ด้วยตัวเอง เช่น หากคุณเลิกงานตอนตี ${exitTime} คุณต้องปรับเวลาในกลุ่ม 09 ให้เป็นอย่างน้อย ${calculateExitTime} (เพื่อหลีกเลี่ยงการเข้างานที่ 2:00 ตรง ซึ่งจะทำให้บันทึกไปยังวันถัดไป) โดยทั่วไปเราจะตั้งเวลาให้ช้ากว่าเวลาหมดงานล่าสุดอย่างน้อย 30 นาที`
  );
  i18n.addResource(
    "vi",
    "translation",
    "note",
    `Nhóm 09 dùng để thiết lập thời gian thay ca, mặc định là nửa đêm (00:00). Nếu bạn chấm công sau 00:00, sẽ ghi vào cột của ngày hôm sau. Tuy nhiên, nếu thời gian tan ca muộn nhất của chúng ta vượt quá 00:00, chúng ta cần điều chỉnh thời gian của Nhóm 09 thủ công. Ví dụ, nếu bạn tan ca lúc ${exitTime} sáng, bạn cần thay đổi Nhóm 09 thành ít nhất ${calculateExitTime} sáng (để tránh việc chấm công đúng 2:00 sáng, khiến dữ liệu bị chuyển sang ngày hôm sau). Thông thường, chúng tôi sẽ cài đặt thời gian này trễ hơn ít nhất 30 phút so với thời gian tan ca muộn nhất.`
  );
  i18n.addResource(
    "cn",
    "translation",
    "note",
    `第09组用于设置换班时间，默认值为午夜（00:00）。如果您在00:00之后打卡，记录将被记入第二天的列中。然而，如果我们的最晚下班时间超过00:00，就需要手动调整第09组的时间。例如，如果您在 ${exitTime} AM下班，则需要将第09组修改为至少 ${calculateExitTime} AM（以避免在2:00 AM打卡后数据被归入第二天）。通常，我们会将这个时间点设置为比最晚下班时间至少延迟30分钟。`
  );
  return newNote;
};

export default useUpdateNotes;
