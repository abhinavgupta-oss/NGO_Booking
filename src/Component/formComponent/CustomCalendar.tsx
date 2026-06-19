import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '../../utility/AppTheam';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const years = Array.from(
  { length: new Date().getFullYear() - 1940 + 1 },
  (_, index) => 1940 + index,
).reverse();

interface CustomCalendarProps {
  title?: string;
  visible?: boolean;
  minDate?: Date;
  maxDate?: Date;
  selectedDate?: Date;

  onDateSelect?: (date: string) => void;

  rangePicker?: boolean;
  startDate?: Date;
  endDate?: Date;
  onRangeSelect?: (
    startDate: string,
    endDate: string,
  ) => void;
}

const CustomCalendar = ({
  title,
  visible = true,
  minDate,
  maxDate,
  selectedDate,
  onDateSelect,
  rangePicker = false,
  startDate,
  endDate,
  onRangeSelect,
}: CustomCalendarProps) => {
  if (!visible) {
    return null;
  }

  const today = new Date();
  const initialDate = startDate || selectedDate || today;

  const [currentMonth, setCurrentMonth] = useState(
    initialDate.getMonth(),
  );

  const [currentYear, setCurrentYear] = useState(
    initialDate.getFullYear(),
  );

  const [selectedFullDate, setSelectedFullDate] = useState(
    initialDate,
  );

  const [rangeStartDate, setRangeStartDate] =
    useState<Date | null>(startDate || null);

  const [rangeEndDate, setRangeEndDate] =
    useState<Date | null>(endDate || null);

  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = `${selectedFullDate
    .getDate()
    .toString()
    .padStart(2, '0')}/${(selectedFullDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${selectedFullDate.getFullYear()}`;

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  const firstDay = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentMonth, currentYear]);

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [firstDay, daysInMonth]);

  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };


  const formatDate = (date: Date) =>
    `${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;

  const isDateInRange = (
    date: Date,
    start: Date | null,
    end: Date | null,
  ) => {
    if (!start || !end) return false;

    return (
      date.getTime() > start.getTime() &&
      date.getTime() < end.getTime()
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      {title && (
        <Text style={{textAlign:"center",fontSize:20,fontFamily:"Poppins-Bold"}}>{title}</Text>
      )}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.monthText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextMonth}
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* MONTH YEAR PICKER */}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Select Month & Year
            </Text>

            <FlatList
              data={years}
              keyExtractor={item => item.toString()}
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              renderItem={({ item: year }) => (
                <View style={{ marginBottom: 14 }}>
                  <Text style={styles.yearHeading}>
                    {year}
                  </Text>

                  <View style={styles.monthGrid}>
                    {monthNames.map((month, monthIndex) => (
                      <TouchableOpacity
                        key={month}
                        activeOpacity={0.8}
                        style={styles.monthItem}
                        onPress={() => {
                          setCurrentMonth(monthIndex);
                          setCurrentYear(year);
                          setShowPicker(false);
                        }}
                      >
                        <Text style={styles.monthItemText}>
                          {month.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.closeButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* WEEK DAYS */}

      <View style={styles.weekRow}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekText}>
            {day}
          </Text>
        ))}
      </View>

      {/* DATES */}

      <View style={styles.daysContainer}>
        {calendarDays.map((day, index) => {
          const currentDateObj = day
            ? new Date(currentYear, currentMonth, day)
            : null;

          const isDisabled =
            !!currentDateObj &&
            ((minDate &&
              normalizeDate(currentDateObj) <
              normalizeDate(minDate)) ||
              (maxDate &&
                normalizeDate(currentDateObj) >
                normalizeDate(maxDate)));

          const isSelected =
            !!day &&
            selectedFullDate.getDate() === day &&
            selectedFullDate.getMonth() === currentMonth &&
            selectedFullDate.getFullYear() === currentYear;

          const isToday =
            !!day &&
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;

          const isRangeStart =
            !!day &&
            rangeStartDate?.getDate() === day &&
            rangeStartDate?.getMonth() === currentMonth &&
            rangeStartDate?.getFullYear() === currentYear;

          const isRangeEnd =
            !!day &&
            rangeEndDate?.getDate() === day &&
            rangeEndDate?.getMonth() === currentMonth &&
            rangeEndDate?.getFullYear() === currentYear;

          const isInRange =
            !!day &&
            isDateInRange(
              currentDateObj!,
              rangeStartDate,
              rangeEndDate,
            );

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              disabled={!day || isDisabled}
              onPress={() => {
                const pressedDate = new Date(
                  currentYear,
                  currentMonth,
                  day as number,
                );

                if (rangePicker) {
                  if (
                    !rangeStartDate ||
                    (rangeStartDate && rangeEndDate)
                  ) {
                    // First selection or reset range
                    setRangeStartDate(pressedDate);
                    setRangeEndDate(null);
                  } else {
                    // Second selection
                    if (
                      pressedDate.getTime() <
                      rangeStartDate.getTime()
                    ) {
                      setRangeStartDate(pressedDate);
                      setRangeEndDate(rangeStartDate);
                    } else {
                      setRangeEndDate(pressedDate);
                    }
                  }
                } else {
                  setSelectedFullDate(pressedDate);

                  onDateSelect?.(
                    formatDate(pressedDate),
                  );
                }
              }}
              style={[
                styles.dayButton,
                isToday && styles.todayDay,
                isSelected && styles.selectedDay,
                isRangeStart && styles.selectedDay,
                isRangeEnd && styles.selectedDay,
                isInRange && styles.rangeDay,
                isDisabled && styles.disabledDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  (isSelected ||
                    isRangeStart ||
                    isRangeEnd) &&
                  styles.selectedDayText,
                  isDisabled &&
                  styles.disabledDayText,
                ]}
              >
                {day || ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {rangePicker &&
        rangeStartDate &&
        rangeEndDate && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.confirmButton}
            onPress={() => {
              onRangeSelect?.(
                formatDate(rangeStartDate),
                formatDate(rangeEndDate),
              );
            }}
          >
            <Text style={styles.confirmButtonText}>
              Confirm
            </Text>
          </TouchableOpacity>
        )}
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    top: -100,
    margin: 20,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#FFF',
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthText: {
    fontSize: 20,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  weekText: {
    width: '14.2%',
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayButton: {
    width: '14.2%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 16,
  },

  todayDay: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
  },

  dayText: {
    fontSize: 12,
    color: '#222',
    fontFamily: 'Poppins-Medium',
  },

  disabledDay: {
    opacity: 0.3,
  },

  disabledDayText: {
    color: '#999',
  },

  selectedDayText: {
    color: '#FFF',
    fontFamily: 'Poppins-SemiBold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',
  },

  yearHeading: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  monthItem: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginBottom: 8,
  },

  monthItemText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },

  closeButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },

  footerBox: {
    marginTop: 15,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 14,
  },

  footerText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },

  arrowIcon: {
    tintColor: '#000',
    width: 25,
    height: 25,
  },
  rangeDay: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});