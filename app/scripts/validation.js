// fields masks
const phoneNumberMask = IMask(
  document.getElementById('phoneNumber'), {
    mask: '(000) 000-00-00'
  });
const creditCardNumberMask = IMask(
  document.getElementById('creditCardNumber'), {
    mask: '0000 - 0000 - 0000 - 0000'
  });
const expirationDateMask = IMask(
  document.getElementById('expirationDate'), {
    mask: '00 / 00'
  });

// fields validation
(function () {
  const validations = {
    required: function(value) {
      const result = {
        isCorrect: value !== '',
        message: 'should not be empty'
      };
      return result;
    },
    email: function(value) {
      const redExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const valueCheck = value.match(redExp);
      const result = {
        isCorrect: valueCheck,
        message: 'is incorrect'
      };
      return result;
    },
    phoneNumber: function(value) {
      const redExp = /\d/g;
      const numbers = value.match(redExp);
      const isValid = redExp.test(value);
      const result = {
        isCorrect: isValid && numbers.length === 10,
        message: 'is incorrect'
      };
      return result
    },
    creditCard: function(value) {
      const redExp = /\d/g;
      const isValid = redExp.test(value);
      const numbers = value.match(redExp);
      const result = {
        isCorrect: isValid && numbers.length === 16,
        message: 'is incorrect'
      };
      return result;
    },
    securityCode: function(value) {
      const isValid = /\d/g.test(value);
      const result = {
        isCorrect: isValid && value.length === 3,
        message: 'is incorrect'
      };
      return result;
    },
    expirationDate: function(value) {
      const result = {
        isCorrect: true,
        message: 'is incorrect'
      };
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1;
      // get parts of the expiration date
      const parts = value.replace(/\s+/g, '').split('/');
      const year = parseInt(parts[1], 10) + 2000;
      console.log('year: '+year);
      const month = parseInt(parts[0], 10);
      console.log('month: '+month);
      // compare the dates
      if ((month < 0 || month > 12) || (year < currentYear || year > 2030) || (year == currentYear && month < currentMonth)) {
        result.isCorrect = false;
        return result;
      }
      return result;
    }
  }

  // get form, inputs, messages
  const form = document.getElementById('formCheckout');
  const inputsArray = form.querySelectorAll('.js-formCheckout__fieldInput');
  const errorMessage = document.querySelector(".js-errorMessage");
  const successMessage = document.querySelector(".js-successMessage");
  const formCheckoutSection = document.getElementById('formCheckoutSection');
  
  form.addEventListener('submit', function(e){
    let i = 0;
    // inputs cycle
    while (i < inputsArray.length) {
      const attr = inputsArray[i].getAttribute('data-validation');
      const rules = attr ? attr.split(' ') : '';
      const wrapper = inputsArray[i].closest(".js-formCheckout__field");
      let j = 0;
      // rules cycle
      while (j < rules.length) {
        if(!validations[rules[j]](inputsArray[i].value).isCorrect) {
          e.preventDefault();
          
          errorMessage.classList.remove('-state_hidden');
          errorMessage.innerHTML = `${inputsArray[i].name} ${validations[rules[j]](inputsArray[i].value).message}`;
          successMessage.classList.add('-state_hidden');
          wrapper.classList.add('-type_error');
          return false;
        }
        errorMessage.classList.add('-state_hidden');
        wrapper.classList.remove('-type_error');
        j++;
      }
      i++;
    }
    e.preventDefault();
    form.outerHTML = "";
    delete form;
    successMessage.classList.remove('-state_hidden');
    formCheckoutSection.classList.add('-state_success');
  }, false)
})();
