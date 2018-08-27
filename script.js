const input = {
  "devices": [{
      "id": "F972B82BA56A70CC579945773B6866FB",
      "name": "Посудомоечная машина",
      "power": 950,
      "duration": 3,
      "mode": "night"
    },
    {
      "id": "C515D887EDBBE669B2FDAC62F571E9E9",
      "name": "Духовка",
      "power": 2000,
      "duration": 2,
      "mode": "day"
    },
    {
      "id": "02DDD23A85DADDD71198305330CC386D",
      "name": "Холодильник",
      "power": 50,
      "duration": 24
    },
    {
      "id": "1E6276CC231716FE8EE8BC908486D41E",
      "name": "Термостат",
      "power": 50,
      "duration": 24
    },
    {
      "id": "7D9DC84AD110500D284B33C82FE6E85E",
      "name": "Кондиционер",
      "power": 850,
      "duration": 1
    }
  ],
  "rates": [{
      "from": 7,
      "to": 10,
      "value": 6.46
    },
    {
      "from": 10,
      "to": 17,
      "value": 5.38
    },
    {
      "from": 17,
      "to": 21,
      "value": 6.46
    },
    {
      "from": 21,
      "to": 23,
      "value": 5.38
    },
    {
      "from": 23,
      "to": 7,
      "value": 1.79
    }
  ],
  "maxPower": 2100
};

const finalResult = {
  "schedule": {},
  "consumedEnergy": {
    "value": 0,
    "devices": {}
  }
};

const hours = [];

// найти тариф по часу
const findRate = hour => {
  let result = 0;
  input.rates.forEach(function(rate) {
    if ((rate.from <= hour) && (hour < rate.to))
      result = rate.value;
    if (rate.to < rate.from) {
      if ((rate.from <= hour) && (hour < 24))
        result = rate.value;
      if ((0 <= hour) && (hour < rate.to))
        result = rate.value;
    }
  })

  return result;
}

// функция возвращает можно ли использовать устройство в этот час
const isGoodHour = (hour, device) => {
  if (device.mode == "day") { if ((hour >= 7) && (hour < 21)) return true;
    else return false; }
  if (device.mode == "night") { if ((hour < 7) || (hour >= 21)) return true;
    else return false; }
  return true;
}

// инициализация массива с часами
for (let i = 0; i < 24; i++)
  hours[i] = { devices: [], power: input.maxPower, rate: findRate(i) };
for (let i = 0; i < 24; i++)
  finalResult.schedule[i] = [];

// сортируем массив устройств по мощности и времени
input.devices.sort(function(a, b) {
  if ((a.duration == 24) && (b.duration == 24)) return 0;
  if (a.duration == 24) return -1;
  if (b.duration == 24) return 1;
  if (a.power < b.power) {
    return 1;
  }
  if (a.power > b.power) {
    return -1;
  }
  return 0;
});

// включить устройство в заданный час
const deviceTurnOn = (hour, device) => {
  hours[hour].devices.push(device.id);
  hours[hour].power -= device.power;

  if (!finalResult.consumedEnergy.devices.hasOwnProperty(device.id)) {
    finalResult.consumedEnergy.devices[device.id] = 0;
  }

  finalResult.consumedEnergy.devices[device.id] += device.power * findRate(hour) / 1000.0;
  finalResult.consumedEnergy.value += device.power * findRate(hour) / 1000.0;

  finalResult.schedule[hour].push(device.id);

}

input.devices.forEach(function(device) {
  if (device.duration == 24) {
    for (let i = 0; i < 24; i++)
      deviceTurnOn(i, device);
  } else {
    let bestHour = -1;
    let bestConsume = 10000000000;

    // считаем потребление денег для 24 вариантов (часы) когда можно включить
    for (let i = 0; i < 24; i++) {
      let consume = 0;
      let fail = false;
      for (let j = 0; j < device.duration; j++) {
        let hour = i + j;
        if (hour >= 24) hour -= 24;
        // eсли нельзя включать в этот час
        if (!isGoodHour(hour, device)) fail = true;
        // если превышено потребление
        if (hour.power - device.power < 0) fail = true;

        consume += device.power * hours[hour].rate;
      }

      if (!fail)
        if (consume < bestConsume) {
          bestHour = i;
          bestConsume = consume;
        }
    }

    // если нашли вариант включения - включить
    if (bestHour != -1)
      for (let j = 0; j < device.duration; j++) {
        const hour = j + bestHour;
        if (hour >= 24) hour -= 24;
        deviceTurnOn(hour, device);
      }
    else {
      // не удалось включить устройство
      console.log('не удалось включить устройство');
    }

  }
});

// записать результат
console.log(finalResult);

const answer = document.querySelector('.answer');
answer.innerHTML = 'the result is:' + JSON.stringify(finalResult, null, 2)
