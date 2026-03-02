function runDiscipline(mode) {

const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getSheetByName("Daily Execution");
const control = ss.getSheetByName("System_Control");

const data = sheet.getDataRange().getValues();

const today = new Date();
today.setHours(0,0,0,0);

let appliedToday = 0;
let todayFound = false;

let target = sheet.getRange("G1").getValue();

/* OFF DAY CHECK */
let offDay = control.getRange("B3").getValue();

if (offDay === true) {
  Logger.log("Off day declared. Skipping discipline check.");
  return;
}

for (let i = 1; i < data.length; i++) {

  if (!data[i][0]) continue;

  let rowDate = new Date(data[i][0]);
  rowDate.setHours(0,0,0,0);

  if (rowDate.getTime() === today.getTime()) {
    appliedToday = data[i][2] || 0;
    todayFound = true;
    break;
  }
}

if (!todayFound) appliedToday = 0;

let remaining = target - appliedToday;

const BOT_TOKEN="8593039530:AAEAlhxVudT4L1_kAAPNBOejsUEN3Wdamhg";
const CHAT_ID="5814614320";

function send(msg){

MailApp.sendEmail(
Session.getActiveUser().getEmail(),
"JOB DISCIPLINE SYSTEM",
msg
);

UrlFetchApp.fetch(
"https://api.telegram.org/bot"+
BOT_TOKEN+
"/sendMessage?chat_id="+
CHAT_ID+
"&text="+encodeURIComponent(msg)
);
}

/* ✅ SUCCESS CONDITION */
if (appliedToday >= target) {

let streak = control.getRange("B1").getValue() + 1;

control.getRange("B1").setValue(streak);
control.getRange("B2").setValue(new Date());

send(
"✅ TARGET COMPLETED\n\n"+
"🔥 Streak: "+streak+" days\n"+
"Momentum maintained."
);

return;
}

/* ✅ ESCALATION BASED ON MODE */

if(mode === "warning"){

send(
"⚠️ WARNING\n"+
"Remaining Applications: "+remaining+
"\nStart immediately."
);

}

else if(mode === "strict"){

send(
"🚨 DISCIPLINE FAILURE\n\n"+
"You chose comfort today.\n"+
"Remaining: "+remaining+
"\nApply NOW."
);

}

else if(mode === "military"){

send(
"❌ DAY FAILING\n\n"+
"No one is coming to save you.\n"+
"Remaining: "+remaining+
"\nFinish before sleep."
);

control.getRange("B1").setValue(0);
}

}


/* ===== TRIGGER FUNCTIONS ===== */

function warningCheck(){
runDiscipline("warning");
}

function strictCheck(){
runDiscipline("strict");
}

function militaryCheck(){
runDiscipline("military");
}