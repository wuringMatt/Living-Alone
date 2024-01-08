import { setData } from "$lib/dataHandling.js";

const eventsUrl = 'https://www.eventbriteapi.com/v3/organizers/46922150853/events/';
const authToken = 'SGGIXSMFLSIJL46TGYFF';
let filteredEvents;

export async function load(){
    const eventResponse = await fetch(eventsUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        }
    }).then(res => {
        return res.json();
    });

    if (eventResponse) {
        filteredEvents = eventResponse.events.map(event => ({
            Name: event.name.text,
            Img: event.logo.url,
            Description: event.description.text,
            Link: event.url,
            City: null,
            StartDate: formatDateString(event.start.utc),
            EndDate: formatDateString(event.end.utc),
            StartTime: formatDateTimeString(event.start.utc),
            EndTime: formatDateTimeString(event.end.utc),
        }));

        const locationsPromises = eventResponse.events.map(async (event, index) => {
            const locationsUrl = `https://www.eventbriteapi.com/v3/venues/${event.venue_id}/`;

            const locationResponse = await fetch(locationsUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            }).then((res) => {
                res.json().then((res) => {
                    filteredEvents[index].City = res.address.city;
                    setData('users/{userid}/events/' + filteredEvents[index].Name, filteredEvents[index])
                        .catch((err) => console.log(err));
                })
            });
        });
    }
}

function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${day}-${month}`;
}

function formatDateTimeString(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}