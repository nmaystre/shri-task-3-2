# shri-task-3-2

 результат задания вынесла в HTML 


# Ход решения

- Сортируем устройства по мощности (но те, что должны работать 24 часа в сутки, выносим вперед)
- В подготовленный массив с часами начинать записывать устройства и вычитать использованную мощность
- Записываем устройства путем перебора вариантов размещения (убрав те из них, которые не подходят по привышению потребляемой мощности или режиму работы - день/ночь) 
- Считаем минимум по цене. Если не удалось найти интервал, в котором устройство можно включить - оно не включается.
- После этого в конце подсчитываем итоговое потребление по деньгам каждым устройством
