document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("siteHeader");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const year = document.getElementById("year");
  const form = document.getElementById("leadForm");
  const formStatus = document.getElementById("formStatus");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Тень/состояние шапки при скролле
  window.addEventListener("scroll", function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  });

  // Мобильное меню
  if (burger && nav) {
    burger.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      burger.classList.toggle("active", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("no-scroll", isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  // FAQ аккордеон
  const accordionTriggers = document.querySelectorAll(".accordion-trigger");

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const item = trigger.closest(".accordion-item");
      const panel = item.querySelector(".accordion-panel");
      const isOpen = item.classList.contains("open");

      // Закрываем другие открытые элементы
      document.querySelectorAll(".accordion-item.open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
          openItem.querySelector(".accordion-panel").style.maxHeight = null;
        }
      });

      item.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));

      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        panel.style.maxHeight = null;
      }
    });
  });

  // Появление блоков при скролле
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // Форма
  if (form && formStatus) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      formStatus.className = "form-status";
      formStatus.textContent = "Отправляем...";

      if (!form.checkValidity()) {
        formStatus.textContent = "Заполните обязательные поля и подтвердите согласие.";
        formStatus.classList.add("error");
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Honeypot от простых ботов
      if (data.website && data.website.trim() !== "") {
        form.reset();
        formStatus.textContent = "Заявка отправлена. Менеджер свяжется в рабочее время.";
        formStatus.classList.add("success");
        return;
      }

      try {
        /**
         * Здесь подключите отправку формы:
         * - на ваш backend;
         * - в Telegram Bot API через backend;
         * - в CRM;
         * - на email через серверный скрипт.
         *
         * Пример:
         * await fetch("/api/lead", {
         *   method: "POST",
         *   headers: { "Content-Type": "application/json" },
         *   body: JSON.stringify(data)
         * });
         */

        console.log("Данные заявки:", data);

        formStatus.textContent = "Заявка отправлена. Менеджер свяжется в рабочее время.";
        formStatus.classList.add("success");
        form.reset();
      } catch (error) {
        console.error(error);
        formStatus.textContent = "Ошибка отправки. Позвоните нам или напишите на email.";
        formStatus.classList.add("error");
      }
    });
  }
});