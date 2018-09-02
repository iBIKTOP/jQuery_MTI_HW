//функция которая рандомно возвращяет disabled
function getRandDisabled(){
    if (Math.random()<0.5) return 'disabled'
}
//делаем красоту при выборе цвета футболки + добавляем блок с выбором размера
window.onload = function () {
    //создание функции, которая при загрузке страницы рисует цвета
    let getColor = () => {
        let html = '';
        $.ajax({
            method: 'GET',
            url: "./data/colors.json",
            context: {}
        })
            .fail(function () {
                alert("Не смог прочитать файл \"colors.json\"");
            })
            .done(function(data) {
                // console.log(data);
                html = '<p class="text">Шаг №1: Выбор цвета футболки:</p>';
                for (let i=0; i<data.length; i++){
                    let id = `color${data[i].name}`;
                    let color_id = `${data[i].id}`;
                    let image_src = `img/${data[i].name}.png`;
                    let color = data[i].name;
                    if (color == 'White') html += `<div id="${id}" class="color active" data-color_id="${color_id}" data-color = "${color}" data-image_src="${image_src}"></div>`;
                    else html += `<div id="${id}" class="color" data-color_id="${color_id}" data-color = "${color}" data-image_src="${image_src}"></div>`;
                }
                $('.colors').append(html);

                // слушаем нажатие на цвет
                $('.color').click(function() {
                    let color_id = $(this).data('color_id');
                    let src = $(this).data('image_src');//ститываем ссылку на картинку с цветом футболки
                    let color = $(this).data("color");
                    $('#image').css('display','none').attr('src', src).fadeIn(1000); //устанавливаем картинку
                    $('div.quantity').css('display','none').empty();
                    $('.color').removeClass('active');
                    $(this).addClass('active');
                    // создаем функцию которая будет рисовать размеры
                    let getSizes = () => {
                        $.ajax({
                            method: 'GET',
                            url: "./data/colors_size_price.json",
                            context: {}
                        })
                            .fail(function () {
                                alert("Не смог прочитать файл \"colors_size_price.json\"");
                            })
                            .done(function(data) {
                                let html = '<p class="text">Шаг №2: Выбор размера футболки:</p>';
                                for (let i=0; i<data.length; i++){
                                    if (parseInt(color_id)==data[i].color_id) {
                                        let arr = data[i].sizes;
                                        for (let i=0; i<arr.length; i++){
                                            html += `<button type="button" class="btn btn-outline-dark" data-price = "${arr[i].price}" ${getRandDisabled()}>${arr[i].size}</button>`;
                                        }
                                    }
                                }
                                $('div.size').css('display','none').empty().append(html).fadeIn(1000);

                                // создаем функцию, которая создает форму количества футболок с проверкой
                                $('div.size .btn').click(function () {
                                    $('div.quantity').css('display','none').empty().append('<hr>' +
                                        '<form id="myform">' +
                                            '<p class="text">Шаг №3: Выбор количества футболок:</p>' +
                                            '<div class="form-group">' +
                                                '<div><button class="btn btn-outline-success" style="width:100px;font-weight:bold" type="button" id="plus">+</button></div>' +
                                                '<div><input type="text" class="form-control" name="quantity" id="quantity" value="0" style="width:100px; text-align: center;"></div>' +
                                                '<div><button class="btn btn-outline-success" style="width:100px;font-weight:bold" type="button" id="minus">-</button></div>' +
                                            '</div>' +
                                            '<button type="submit" class="btn btn-primary">В корзину</button>' +
                                            '<span id="price" style="margin-left: 50px; font-size: 20px;">Итого: 0грн.</span>' +
                                        '</form><hr>').fadeIn(1000);

                                    let price = $(this).data("price");
                                    // создаем функцию - меняет итоговую стоимость и проверяет на вод данных
                                    let priceFinish = () => {
                                        let val = parseInt($("#quantity").val());
                                        if (val>=0&&val<=99) {
                                            $('#price').text(`Итого: ${val * price}грн.`);
                                            if (val>5) {
                                                $('#price').text(`Итого (-15%): ${val * price * 0.85}грн.`);
                                            }
                                        }

                                    };
                                    // создаем функцию - +1 к количеству футболок с проверкой
                                    $("#plus").click(function () {
                                        let val = parseInt($("#quantity").val());
                                        if (val>=0&&val<=99) {
                                            $("#quantity").val(parseInt($("#quantity").val())+1);
                                        }
                                        priceFinish();
                                    });
                                    // создаем функцию - -1 к количеству футболок с проверкой
                                    $("#minus").click(function () {
                                        let val = parseInt($("#quantity").val());
                                        if (val>0&&val<=100) {
                                            $("#quantity").val(parseInt($("#quantity").val())-1);
                                        }
                                        priceFinish();
                                    });
                                    // создаем функцию - валидация если пользователь сам вводит количество.
                                    $('#quantity').keyup(function () {
                                            $("#myform").validate({
                                                rules: {
                                                    quantity: {
                                                        required: true,
                                                        digits: true,
                                                        min: 1,
                                                        max: 100
                                                    }
                                                },
                                                messages: {
                                                    quantity: {
                                                        required: "Введите пожалуйста количество от 1 до 100",
                                                        digits: "Введите пожалуйста количество от 1 до 100",
                                                        min: "Введите пожалуйста количество от 1 до 100",
                                                        max: "Введите пожалуйста количество от 1 до 100"
                                                    }
                                                }
                                            });
                                        priceFinish();
                                    });
                                });
                            });
                    };
                    getSizes(); // запускаем функцию, которая будет рисовать размеры
                });
            });
    };
    getColor(); // вызов функции, которая при загрузке страницы рисует цвета
};
