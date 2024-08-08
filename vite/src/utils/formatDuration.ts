export const formatDuration = (duration: number): string => {
  if (duration >= 60) {
    const totalMinutes = (duration / 60).toFixed(2).replace(".", ":");
    return `${totalMinutes} minutos`;
  } else {
    const seconds = duration.toFixed(2).replace(".", ",");
    return `${seconds} segundos`;
  }
};
