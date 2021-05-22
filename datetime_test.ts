import Datetime from "./datetime.ts";

const dd = new Datetime(new Date());

console.log(dd.getDate());
console.log(dd.startOfDay());
console.log(dd.endOfDay());
console.log(dd.startOfMonth());
console.log(dd.endOfMonth());
console.log(dd.tz("Asia/Tokyo").getDate());
