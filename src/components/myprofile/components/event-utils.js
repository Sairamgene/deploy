let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  // {
  //   id: createEventId(),
  //   title: 'Creted Dashboards - 6hrs',
  //   start: todayStr,
  //   hours: 6,
  //   projectId: '123',
  //   eventType: 'timesheet'
  // },
  {
    id: createEventId(),
    title: 'Creted Dashboards - 2hrs',
    start: todayStr,
    hours: 2,
    projectId: '124',
    eventType: 'timesheet'
  }
]

export function createEventId() {
  // return String(eventGuid++)
  return `xxx-4xxx-yxx`.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function hashById(array) {
  let hash = {}

  for (let item of array) {
    hash[item.id] = item
  }

  return hash
}
