const events = require('./events.json');
const users = require('./users.json');

const WORKING_START_TIME = '13:00:00';
const WORKING_END_TIME = '21:00:00';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const getDatePart = (datetimeString) => datetimeString.substring(0, 10);

const formatSlot = (slot) => `${getDatePart(slot.start_time)} ${slot.start_time.substring(11, 16)} - ${slot.end_time.substring(11, 16)}`;

const findAvailability = (groups) => {
  const groupIds = users.filter((user) => groups.includes(user.name)).map((user) => user.id);
  const groupEvents = events.filter((event) => groupIds.includes(event.user_id));
  const dates = groupEvents.map((item) => getDatePart(item.start_time)).filter(onlyUnique);
  
  dates.forEach((date) => {
    groupEvents.push({
      start_time: `${date}T00:00:00`,
      end_time: `${date}T${WORKING_START_TIME}`,
    });
    groupEvents.push({
      start_time: `${date}T${WORKING_END_TIME}`,
      end_time: `${date}T24:00:00`,
    });
  });

  const sortedEvents = groupEvents.sort((a, b) => a.start_time > b.start_time ? 1 : -1);

  const slots = [];
  for (let i = 1; i < sortedEvents.length; i ++) {
    if (sortedEvents[i - 1].end_time < sortedEvents[i].start_time && sortedEvents[i - 1].end_time.substring(0, 10) === sortedEvents[i].start_time.substring(0, 10)) {
      slots.push({
        start_time: sortedEvents[i - 1].end_time,
        end_time: sortedEvents[i].start_time,
      });
    }
  }
  return slots;
};

const names = process.argv.slice(2);
// const names = ['Maggie', 'Joe', 'Jordan'];
console.log(findAvailability(names).map(formatSlot).join('\n'));
