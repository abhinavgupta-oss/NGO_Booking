import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
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

interface CustomCalendarProps {
  visible?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onDateSelect?: (date: string) => void;
}

const CustomCalendar = ({
  visible = true,
  minDate,
  maxDate,
  onDateSelect,
}: CustomCalendarProps) => {

  if (!visible) {
    return null;
  }
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showPicker, setShowPicker] = useState(false);

  const selectedFullDate = new Date(
    currentYear,
    currentMonth,
    selectedDate,
  );

  const formattedDate = `${selectedDate
    .toString()
    .padStart(2, '0')}/${(currentMonth + 1)
    .toString()
    .padStart(2, '0')}/${currentYear}`;

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

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={styles.iconButton}
        >
          <MaterialIcons
            name="chevron-left"
            size={28}
            color={colors.primary}
          />
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
          <MaterialIcons
            name="chevron-right"
            size={28}
            color={colors.primary}
          />
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

            <ScrollView
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={false}
            >
              {Array.from(
                {
                  length: new Date().getFullYear() - 1940 + 1,
                },
                (_, index) => 1940 + index,
              )
                .reverse()
                .map(year => (
                <View key={year} style={{ marginBottom: 14 }}>
                  <Text style={styles.yearHeading}>{year}</Text>

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
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.closeButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
            ((minDate && currentDateObj < minDate) ||
              (maxDate && currentDateObj > maxDate));

          const isSelected = selectedDate === day;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              disabled={!day}
              onPress={() => {
                const pressedDate = new Date(
                  currentYear,
                  currentMonth,
                  day as number,
                );

                if (minDate && pressedDate < minDate) {
                  return;
                }

                if (maxDate && pressedDate > maxDate) {
                  return;
                }

                setSelectedDate(day as number);

                onDateSelect?.(
                  `${(day as number)
                    .toString()
                    .padStart(2, '0')}/${(currentMonth + 1)
                    .toString()
                    .padStart(2, '0')}/${currentYear}`,
                );
              }}
              style={[
                styles.dayButton,
                isSelected && styles.selectedDay,
                isDisabled && styles.disabledDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isDisabled && styles.disabledDayText,
                ]}
              >
                {day || ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SELECTED DATE */}

      <View style={styles.footerBox}>
        <Text style={styles.footerText}>
          Selected Date: {formattedDate}
        </Text>
      </View>
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF3E8',
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
    marginBottom: 10,
  },

  selectedDay: {
    backgroundColor: '#ED7723',
    borderRadius: 16,
  },

  dayText: {
    fontSize: 15,
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
    color: '#ED7723',
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
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    marginBottom: 10,
  },

  monthItemText: {
    color: '#ED7723',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },

  closeButton: {
    marginTop: 10,
    backgroundColor: '#ED7723',
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
    backgroundColor: '#FFF3E8',
    borderRadius: 14,
    padding: 14,
  },

  footerText: {
    fontSize: 14,
    color: '#ED7723',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});

