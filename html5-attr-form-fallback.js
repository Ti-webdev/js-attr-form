;(function() {
	var REMOVE_HIDDEN_AFTER_SUMIT_TIMEOUT = 50

	function isSupportFormAttribute() {
		try {
			var input
			input = document.createElement('input')
			// аттрибут form прикрепляет элемент к фомре с таким id="custom-id"
			input.setAttribute('form', 'custom-id')

			var form
			form = document.createElement('form')
			form.appendChild(input)

			// если параметр form совпадает с формой в которой элемент находится
			// значит атрибут form не поддерживается
			var support = form !== input.form
			return support
		}
		catch(e) {
			window.console && console.log(e)

			// при любой ошибке считаем что аттрибут не поддерживется
			return false
		}
	}


	if (isSupportFormAttribute()) return

	var $ = jQuery
	// отправляем соотв. форму
	$(document).delegate('button[type="submit"][form],input[type="submit"][form]', 'click', function() {
		$('#'+$(this).attr('form')).submit()
		return false
	})

	// при отправке формы прикрепляем скрытые поля
	$(document).delegate('form', 'submit', function() {
		if (this.id) {
			var elements = $()

			// для всех именованных элементов и id этой формы
			$('*[name][form="'+this.id+'"]').each(function() {
				var element
				element = $('<input type="hidden">')
				element.prop({
					name: this.name,
					value: this.value
				})

				elements = elements.add(element)
			})
			$(this).append(elements)

			// через таймаут удалим созданные скрытые элементы
			setTimeout(function() {
				elements.remove()
			}, REMOVE_HIDDEN_AFTER_SUMIT_TIMEOUT)
		}
	})
})()