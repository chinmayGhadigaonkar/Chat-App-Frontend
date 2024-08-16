const fileFormat = (url: String = "") => {
  const fileExt = url.split(".").pop();
  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") {
    return "video";
  }

  if (fileExt === "mp3" || fileExt === "wav") {
    return "audio";
  }

  if (
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "png" ||
    fileExt === "gif"
  ) {
    return "image";
  }
  return "file";
};

export default fileFormat;
