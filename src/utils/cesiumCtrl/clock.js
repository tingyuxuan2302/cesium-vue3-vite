import * as Cesium from "cesium";
import dayjs from "dayjs"

const curTime = dayjs().format("YYYY-MM-DD")
const curDate = Cesium.JulianDate.fromIso8601(curTime)
const stopTime = dayjs().add(1, "day").format("YYYY-MM-DD")
export default class Clock {
  constructor(viewer) {
    this.initClock()
    viewer.scene.globe.enableLighting = true;
  }
  initClock() {
    new Cesium.Clock({
      startTime: curDate,
      currentTime: curDate,
      stopTime: Cesium.JulianDate.fromIso8601(stopTime),
      clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
      clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
      multiplier: 4000, // how much time to advance each tick
      shouldAnimate: true, // Animation on by default
    })
  }
}