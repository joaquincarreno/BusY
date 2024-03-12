function spaceInterpolator(start, end, time) {
  return [
    start[0] + (end[0] - start[0]) * time,
    start[1] + (end[1] - start[1]) * time,
  ];
}

function getRelativeTime(start, end, current) {
  end = end - start;
  current = current - start;
  return current / end;
}

// steps = [coord1, coord2, coord3]
// timestamps = [0, 0.4, 1]
// time = 0.5
function Interpolator({ steps, timestamps, time }) {
  var i = 0;
  while (time > timestamps[i]) {
    i = i + 1;
    if (i >= length(timestamps)) {
      return new Error("time out of range");
    }
  }
  const relTime = getRelativeTime(timestamps[i], timestamps[i + 1], time);
  return spaceInterpolator(steps[i], steps[i + 1], relTime);
}

export default Interpolator;
