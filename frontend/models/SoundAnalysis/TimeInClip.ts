class TimeInClip {
    date: Date;

    constructor(minute: number, second: number) {
      let date = new Date(0);
      date.setUTCMinutes(minute, second);
      this.date = date;
    }

    public static fromTimeString(timeString: string): TimeInClip {
        let splitString = timeString.split(":", 2);
        if (splitString.length != 2) {
            throw new Error("Invalid time string");
        }
        let minutes = Number(splitString[0]); // TODO: How long should this be able to be???
        let seconds = Number(splitString[1]);
        if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || minutes > 60 || seconds < 0 || seconds > 60 ) {
            throw new Error("Invalid time string");
        }
        return new TimeInClip(minutes, seconds);
    }

    public formattedString(): string {
        return this.date.getMinutes() + ":" + this.date.getSeconds();
    }

    public getTime() : number {
      return this.date.getTime();
    }


}

export default TimeInClip;
