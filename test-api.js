async function test() {
  const res = await fetch('http://localhost:3001/api/scheduleTemplates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name: "Test Template API", opdSlotTime: 15, schedule: []})
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
