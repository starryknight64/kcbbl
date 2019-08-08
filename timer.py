from datetime import datetime
import time


class Timer:
    def __init__(self):
        self.__elapsed = 0
        self.__startTime = datetime.now()
        self.__started = True
        self.__endTime = None

    def start(self):
        self.__startTime = datetime.now()
        self.__started = True

    def stop(self):
        self.__started = False
        self.__endTime = datetime.now()
        self.__elapsed = self.__endTime - self.__startTime

    def started(self):
        return self.__started

    def elapsed(self):
        return getElapsedString(self.__startTime, datetime.now())


def getElapsedString(startTime, endTime, showAll=False):
    elapsed = endTime - startTime
    minutes, seconds = divmod(elapsed.total_seconds(), 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    weeks, days = divmod(days, 7)
    years, weeks = divmod(weeks, 52)

    elapsedList = []
    if years or showAll:
        elapsedList.append("%dy" % years)
    if weeks or showAll:
        elapsedList.append("%dw" % weeks)
    if days or showAll:
        elapsedList.append("%dd" % days)
    if hours or showAll:
        elapsedList.append("%dh" % hours)
    if minutes or showAll:
        elapsedList.append("%dm" % minutes)
    elapsedList.append("%ds" % seconds)

    return "\t".join(elapsedList)


if __name__ == "__main__":
    date1 = datetime(2012, 11, 27, 4, 20)
    print "Jaxton is this old: %s" % getElapsedString(date1, datetime.now(), True)
    date2 = datetime(2018, 4, 5, 8, 0)
    print "Aurora is this old: %s" % getElapsedString(date2, datetime.now(), True)
    date3 = datetime(2016, 1, 29, 17, 30)
    print "  Finn is this old: %s" % getElapsedString(date3, datetime.now(), True)
    date4 = datetime(1986, 6, 12, 3, 0)
    print "     I am this old: %s" % getElapsedString(date4, datetime.now(), True)

    t = Timer()
    time.sleep(2)
    print "Time Elapsed: %s" % t.elapsed()
