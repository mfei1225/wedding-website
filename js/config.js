/* Wedding site content
   Change the details below, save, and refresh the page.
   Photos live in the images folder. Swap a picture by changing its image path. */

window.WEDDING = {
  couple: {
    a: "Sarah",
    b: "Michael",
    families: "Together with their families",
  },

  event: {
    iso: "2027-06-05T15:00:00",
    weekday: "Saturday",
    dateLine: "June 5, 2027",
    dateLong: "Saturday, the fifth of June",
    yearLong: "Two thousand twenty-seven",
    timeLong: "in the afternoon",
    city: "",
    region: "",
    venue: "",
    street: "",
    hashtag: "#SarahAndMichael",
    allDay: true,
    icsStart: "20270605",
    icsEnd: "20270606",
  },

  hero: {
    english: "Save the Date",
    arrived: "The day is here",
    image: "images/proposal-path.jpg",
    imageAlt: "Sarah and Michael walking a gravel path at golden hour, a stone house behind them",
  },

  invitation: {
    requestLead: "request the pleasure of your company",
    requestTail: "at the celebration of their marriage",
    follow: "A formal invitation will follow.",
    blessing: "",
  },

  when: {
    label: "When",
    title: "Saturday, June 5",
    note: "In the afternoon",
  },

  where: {
    label: "Where",
    title: "To follow",
    note: "The place will be shared soon",
  },

  attire: {
    label: "Attire",
    title: "Festive",
    note: "A fuller note will come with the invitation",
  },

  story: {
    title: "Our Story",
    lead: "A yes, in a garden, with the light going gold.",
    chapters: [
      {
        title: "The path",
        when: "Sands Point",
        body: "They walked the gravel with a stone house behind them. The question had already been asked. The answer was yes.",
      },
      {
        title: "The lawn",
        when: "Still holding on",
        body: "Then they ran. The dress, the hour, and the two of them, all in motion across the grass.",
      },
      {
        title: "The bench",
        when: "Among the flowers",
        body: "And they sat a while, as if the afternoon could stay. It is the day they are asking you to keep.",
      },
    ],
  },

  schedule: {
    title: "The Day",
    lead: "Saturday, June 5. The hour-by-hour will be set closer to the date.",
    days: [
      {
        title: "Saturday",
        date: "June 5",
        events: [
          {
            time: "Afternoon",
            title: "Ceremony",
            note: "A gathering, then a promise.",
          },
          {
            time: "Evening",
            title: "Dinner and dancing",
            note: "Stay through the last song if you can.",
          },
        ],
      },
    ],
  },

  travel: {
    title: "Travel & Stay",
    lead: "Maps and rooms will live here once the place is set.",
    blurb: "Sarah and Michael will share where to gather, where to sleep, and how to get there.",
    hotels: [],
    facts: [
      {
        label: "The day",
        title: "June 5",
        note: "A Saturday in early summer. Hold the date, and we will fill in the rest.",
      },
      {
        label: "Getting there",
        title: "Soon",
        note: "Directions will be added with the invitation.",
      },
      {
        label: "What to pack",
        title: "A light layer",
        note: "June can turn cool once the sun drops. A wrap is a good companion.",
      },
    ],
  },

  registry: {
    title: "If You Wish",
    lead: "Your presence is the gift. A few wishes can live here, if you would like them.",
    gifts: [
      {
        title: "A dinner out",
        note: "Toward a long meal on the trip that follows the wedding.",
        href: "",
      },
      {
        title: "Something for the table",
        note: "A piece they will use on ordinary nights.",
        href: "",
      },
      {
        title: "A book for the shelf",
        note: "A title you have loved, with your name in the front.",
        href: "",
      },
    ],
  },

  party: {
    title: "Beside Us",
    lead: "Family, and the friends who became family.",
    note: "The people standing with Sarah and Michael will be introduced a little closer to the day.",
    groups: [],
  },

  gallery: {
    title: "The Proposal",
    lead: "Sands Point, in the gold of the afternoon.",
    scenes: [
      {
        caption: "The path",
        tone: "ink",
        focus: "center 70%",
        image: "images/proposal-path.jpg",
        alt: "Sarah and Michael walking hand in hand on a gravel path",
      },
      {
        caption: "The lawn",
        tone: "gold",
        focus: "center 46%",
        image: "images/proposal-lawn.jpg",
        alt: "Sarah and Michael running across the grass, holding hands",
      },
      {
        caption: "The bench",
        tone: "silk",
        focus: "center 78%",
        image: "images/proposal-bench.jpg",
        alt: "Sarah and Michael sitting together on a stone bench in a flower garden",
      },
    ],
  },

  faq: {
    title: "Questions",
    lead: "Practical things, answered as far as we know them.",
    items: [
      {
        q: "When should I reply?",
        a: "By May 1, 2027, so there is time to plan the tables and the meal.",
      },
      {
        q: "May I bring a guest?",
        a: "The invitation is for the names written on it. If someone is welcome with you, their name is included.",
      },
      {
        q: "Are children invited?",
        a: "We will say so on the invitation. If you are unsure, write it in your reply and we will answer.",
      },
      {
        q: "What should I wear?",
        a: "Festive. A fuller note on dress, shoes, and the setting will come with the invitation.",
      },
      {
        q: "Where is the wedding, and where should I stay?",
        a: "The place is still being finished. Travel, rooms, and a map will be added here, and again on the invitation.",
      },
      {
        q: "May I take photographs during the ceremony?",
        a: "We will share a short note about photos closer to the day. Until then, plan to tuck your phone away for the ceremony itself.",
      },
      {
        q: "What if I have a dietary need?",
        a: "Tell us on the reply card. We will pass it to the kitchen.",
      },
    ],
  },

  rsvp: {
    title: "Kindly Reply",
    lead: "Tell us if you can be there. It makes the tables kinder and the kitchen calmer.",
    deadline: "Kindly reply by May 1, 2027",
    accept: "Joyfully accept",
    decline: "Unable to attend",
    meals: [
      { id: "chicken", label: "Chicken", note: "Lemon and herbs" },
      { id: "salmon", label: "Salmon", note: "A light garden sauce" },
      { id: "garden", label: "Garden plate", note: "The best of early summer" },
    ],
    maxGuests: 8,
    /* Replies are saved in Google Forms once action and the entry numbers are filled in.
       1. Make a form with eight short-answer questions, in this order:
          Name, Email, Reply, Party size, Place cards, Plate, Song, Note.
          Leave them optional. A required blank answer is dropped by Google.
       2. In the form, open the three-dot menu and choose Get pre-filled link.
       3. Type a word in every question, then copy the link it gives you.
       4. That link contains entry.123456789 eight times. Paste each number below, in the same order.
       5. The form's share link ends in /viewform. Change that word to formResponse and paste it as action.
       Answers show up under Responses, and in the sheet linked from there. */
    googleForm: {
      action: "",
      entries: {
        name: "",
        email: "",
        attendance: "",
        guests: "",
        guestNames: "",
        meal: "",
        song: "",
        note: "",
      },
    },
  },

  footer: {
    blessing: "With love",
  },

  nav: [
    // { href: "#story", label: "Story" },
    { href: "#schedule", label: "The day" },
    { href: "#travel", label: "Stay" },
    // { href: "#registry", label: "Gifts" },
    { href: "#gallery", label: "Photos" },
    { href: "#faq", label: "Questions" },
  ],
};
