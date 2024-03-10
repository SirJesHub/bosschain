import React, { useState } from "react";
import Datetime, { DatetimepickerProps } from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment, { Moment } from "moment";

interface DatePickerProps {
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: string | Moment) => {
    let convertedDate: Date | null = null;
    if (typeof date === "string") {
      convertedDate = new Date(date);
    } else if (moment.isMoment(date)) {
      convertedDate = date.toDate();
    }
    setSelectedDate(convertedDate);
    onChange(convertedDate);
  };

  return (
    <div>
      <Datetime
        value={selectedDate || undefined}
        onChange={(date) => handleDateChange(date)}
        inputProps={{ placeholder: "Select date and time" }}
      />
    </div>
  );
};

export default DatePicker;
