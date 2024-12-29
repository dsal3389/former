import $ from 'jquery';
import { MessageListener } from "@/lib/messages";

console.log("starting to listen")
$("#former-log-block").text("hello world");
new MessageListener().onMessage((event) => {
    $("#former-log-block").text(JSON.stringify(event));
});
