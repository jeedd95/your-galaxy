export function nowTime(now: Date) {
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];

  return date + " " + time;
}

export function GetResetTime() {
  let nextResetTime: Date;
  let remain: number;

  const now = new Date();
  const resetTime = new Date();
  resetTime.setUTCHours(21, 0, 0, 0);

  //21시 이전
  if (now < resetTime) {
    nextResetTime = resetTime;
  }
  //21시 이후 24시 이전
  else {
    nextResetTime = resetTime;
    nextResetTime.setUTCDate(resetTime.getUTCDate() + 1); //다음날의 초기화 시간
  }

  remain = nextResetTime.getTime() - now.getTime();

  return { nextResetTime, remain };
}

export function formattedTime(time: number) {
  const seconds = Math.floor(time / 1000) % 60;
  const minutes = Math.floor(time / (1000 * 60)) % 60;
  const hours = Math.floor(time / (1000 * 60 * 60));

  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedHours = String(hours).padStart(2, "0");

  return { formattedHours, formattedMinutes, formattedSeconds };
}

export function formattedDay(time: number) {
  const days = String(Math.floor(time / (1000 * 60 * 60 * 24)));
  const hours = String(
    Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const minutes = String(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = String(Math.floor((time % (1000 * 60)) / 1000));

  return { days, hours, minutes, seconds };
}
