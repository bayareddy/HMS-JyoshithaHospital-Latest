async function test() {
  const reqTemplate = {
    name: 'Full Test',
    opdSlotTime: 15,
    schedule: [
      { day: 'Monday', tasks: [] },
      { day: 'Tuesday', tasks: [] },
      { day: 'Wednesday', tasks: [] },
      { day: 'Thursday', tasks: [] },
      { day: 'Friday', tasks: [] },
      { day: 'Saturday', tasks: [] },
      { day: 'Sunday', tasks: [] }
    ]
  };
  const res = await fetch('http://localhost:3001/api/scheduleTemplates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqTemplate)
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
