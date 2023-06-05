/*
create ics calendar file from dates
Validate ics: https://icalendar.org/validator.html
*/

function download(content, mimeType, filename) {
  // Blob Dokumentation, siehe:
  // https://developer.mozilla.org/en-US/docs/Web/API/Blob
  const a = document.createElement("a") // Create 'a' element
  const blob = new Blob([content], { type: mimeType }) // Create a blob (file-like object)
  const url = URL.createObjectURL(blob) // Create an object URL from blob
  a.setAttribute("href", url) // Set 'a' element link
  a.setAttribute("download", filename) // Set download filename
  a.click() // Start downloading
}

function dateString(d) {
  const year = d.getFullYear()
  const monthRaw = d.getMonth() + 1 // fängt sonst bei 0 an
  const month = monthRaw.toString().padStart(2, "0")
  const day = d.getDate().toString().padStart(2, "0")
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  return `${year}${month}${day}T${hours}${minutes}00` // last seconds
}

// get all dates as text
const downloadLink = document.getElementById("ics-download")
const dateElement = document.querySelectorAll(".schoolday")

const dates = [...dateElement].map((el) => {
  const id = Math.trunc(Math.random() * 10000)
  const newEvent = new Date(el.dataset.date)
  const teacher = el.dataset.teacher
  const room = el.dataset.room
  const summary = el.dataset.title
  return {
    id: id,
    start: new Date(newEvent.setHours(9, 30)),
    end: new Date(newEvent.setHours(16, 30)),
    teacher: teacher,
    room: room,
    summary: summary,
  }
})

const mimeType = "text/calendar;charset=utf-8;"

const header = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN`

let body = ""
dates.forEach((item) => {
  const foo = `BEGIN:VEVENT
UID:${item.id}@c4ta.ch
DTSTAMP:${dateString(new Date(Date.now()))}
DTSTART:${dateString(item.start)}
DTEND:${dateString(item.end)}
LOCATION:Toni Areal\\, Zürich
SUMMARY:${item.summary}
DESCRIPTION:Zimmer ${item.room}\\n${item.teacher}
END:VEVENT
`
  // URL:https://uiux-curriculum.c4ta.ch
  body += foo
})

const footer = `END:VCALENDAR`

const content = `${header}
${body}${footer}`

// console.log(content)

downloadLink.setAttribute("href", "termine.ics")

downloadLink.addEventListener("click", (e) => {
  e.preventDefault()
  download(content, mimeType, "termine.ics")
  // console.log(content)
})
