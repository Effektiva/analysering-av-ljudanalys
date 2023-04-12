/**
* This class represents a time in a soundclip. It is used to represent when a comment is made in a soundclip.
*/
class TimeInClip {

  private minute: number;
  private second: number;

  /**
  * Creates a new TimeInClip object.
  * @param minute The minute in the clip.
  * @param second The second in the clip.
  * @throws Error if the minute or second is invalid.
  */
  constructor(minute: number, second: number) {
    // We can be an arbitrary amount of minutes into the clip, but we can only be at max 59 seconds into the minute.
    if (second < 0 || second >= 60) {
      throw new Error("Invalid time");
    }
    this.minute = minute;
    this.second = second;
  }

  /**
   * Creates a new TimeInClip object from a time string in the format "mm:ss".
   * @param timeString
   * @returns
   */
  public static fromTimeString(timeString: string): TimeInClip {
    let splitString = timeString.split(":", 2);
    if (splitString.length != 2) {
      throw new Error("Invalid time string");
    }
    let minutes = Number(splitString[0]);
    let seconds = Number(splitString[1]);
    if (isNaN(minutes) || isNaN(seconds)) {
      throw new Error("Invalid time string");
    }
    return new TimeInClip(minutes, seconds);
  }

  /**
   * Returns a string representation of the time in the format "mm:ss" or "hh:mm:ss" if the time is more than an hour.
   */
  public formattedString(): string {
    if (this.minute >= 60) {
      let hours = Math.floor(this.minute / 60);
      let minutes = this.minute % 60;
      let hourStringPadded = hours.toString().padStart(2, "0");
      let minuteStringPadded = minutes.toString().padStart(2, "0");
      let secondStringPadded = this.second.toString().padStart(2, "0");
      return hourStringPadded + ":" + minuteStringPadded + ":" + secondStringPadded;
    } else {
      let minuteStringPadded = this.minute.toString().padStart(2, "0");
      let secondStringPadded = this.second.toString().padStart(2, "0");
      return minuteStringPadded + ":" + secondStringPadded;
    }
  }

  /**
   * Returns the time in seconds.
   */
  public getTime(): number {
    return this.minute * 60 + this.second;
  }

}

export default TimeInClip;
