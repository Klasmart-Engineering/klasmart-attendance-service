export const  getUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});
}

export const getRandomNumber = (limit = 1000) => {
  return Math.floor((Math.random() * limit));
}

export const getRandomFeedbackType = () => {
  const candidates = ["END_CLASS", "LEAVE_CLASS"];
  const x = getRandomNumber(2);
  return candidates[x];
}

export const getRandomQuickFeedbackType  = () => {
  const candidates = ["video", "audio", "presentation", "other"];
  const x = getRandomNumber(4);
  return candidates[x];
}