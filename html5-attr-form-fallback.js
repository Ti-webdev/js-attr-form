;(function() {
	var SUBMIT_TIMEOUT = 50

	function isSupportFormAttribute() {
		try {
			var input = document.createElement('input')
			// аттрибут form прикрепляет элемент к фомре с таким id="custom-id"
			input.setAttribute('form', 'custom-id')

			var form = document.createElement('form')
			form.appendChild(input)

			// если параметр form совпадает с формой в которой элемент находится
			// значит атрибут form не поддерживается
			var support = form !== input.form
			return support
		}
		catch(e) {
			if (window.console) console.log(e)

			// при любой ошибке считаем что аттрибут не поддерживется
			return false
		}
	}


	if (isSupportFormAttribute()) return


	var $ = jQuery


	// отправка соотв. формы
	$(document).delegate(':submit:enabled[form]', 'click', function() {
		$('#'+$(this).attr('form')).trigger('submit', [this])
		return false
	})
	$(document).delegate('fieldset[form] :submit:enabled', 'click', function() {
		var id = $(this).parent('fieldset[form]').attr('form')
		$('#'+id).trigger('submit', [this])
		return false
	})

	// сброс
	$(document).delegate(':reset:enabled[form]', 'click', function() {
		$('#'+$(this).attr('form')).each(function(){
			this.reset()
		})
		return false
	})
	$(document).delegate('fieldset[form] :reset:enabled', 'click', function() {
		var id = $(this).parent('fieldset[form]').attr('form')
		$('#'+id).each(function(){
			this.reset()
		})
		return false
	})

	// при отправке формы прикрепляем скрытые поля
	$(document).delegate('form', 'submit', function(e, button) {
		var tmpElements = $()
		if (this.id) {
			// ищем именованные элементы
			$(':enabled[name][form="'+this.id+'"]:not(:submit,:reset),fieldset[form="'+this.id+'"] :enabled[name]:not([form])')
			.not('(:checkbox,:radio):not(:checked)')
			.add(button || $()) // + кнопка по которой шелкнули
			.each(function() {
				var element
				element = $('<input type="hidden">')
				element.prop({
					name: this.name,
					value: this.value
				})

				tmpElements = tmpElements.add(element)
			})
			$(this).append(tmpElements)
		}

		// элементы из другой формы
		var query = '[form'+(this.id ? '!="'+this.id+'"' : '')+']'
		var foreignElements = $(this).find(':enabled[name]'+query+',fieldset'+query+' :enabled[name]:not([form'+(this.id ? '="'+this.id+'"' : '')+'])')

		// выключаем
		foreignElements.prop('disabled', true)

		if (foreignElements.length || tmpElements.length) {
			setTimeout(function() {
				// удалим созданные скрытые элементы
				tmpElements.remove()

				// включаем обратно
				foreignElements.prop('disabled', false)
			}, SUBMIT_TIMEOUT)
		}
	})
})()