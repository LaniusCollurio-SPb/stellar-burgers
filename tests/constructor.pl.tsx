import { test, expect, type Locator } from '@playwright/test';

const HAR_PATH = 'tests/hars/ingredients.har';

const BUN_ID = '6acd6b8163765e371c0bd9eb'; // Краторная булка N-200i
const SAUCE_ID = '6acd6b8163765ed1960bd9f3'; // Соус традиционный галактический
const MEAT_ID = '6acd6b8163765e9acf0bd9ef'; // Говяжий метеорит (отбивная)
const CHEESE_ID = '6acd6b8163765e36560bd9f9'; // Сыр с астероидной плесенью

test.describe('Конструктор бургеров', () => {
  let constructorList: Locator;
  let modal: Locator;
  let overlay: Locator;
  let bunCard: Locator;
  let sauceCard: Locator;
  let meatCard: Locator;
  let cheeseCard: Locator;

  test.beforeEach(async ({ page }) => {
    await test.step('Подменяем запрос ингредиентов через HAR', async () => {
      await page.routeFromHAR(HAR_PATH, {
        url: '**/api/ingredients',
        update: false,
      });
    });

    await test.step('Переходим на главную страницу и ждем загрузки', async () => {
      await page.goto('/');
      await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible();

      constructorList = page.getByTestId('constructor-ingredients');
      modal = page.getByTestId('modal');
      overlay = page.getByTestId('modal-overlay');
      bunCard = page.getByTestId(`ingredient-card-${BUN_ID}`);
      sauceCard = page.getByTestId(`ingredient-card-${SAUCE_ID}`);
      meatCard = page.getByTestId(`ingredient-card-${MEAT_ID}`);
      cheeseCard = page.getByTestId(`ingredient-card-${CHEESE_ID}`);
    });
  });

  test('добавляет ингредиент из списка в конструктор', async ({ page }) => {
    await test.step('Кликаем "Добавить" у булки', async () => {
      await bunCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Проверяем, что булка появилась в конструкторе', async () => {
      await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
      await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
    });

    await test.step('Кликаем "Добавить" у соуса', async () => {
      await sauceCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Кликаем "Добавить" у мяса', async () => {
      await meatCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Кликаем "Добавить" у сыра', async () => {
      await cheeseCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Проверяем, что все начинки появились в конструкторе', async () => {
      await expect(
        constructorList.getByText('Соус традиционный галактический')
      ).toBeVisible();
      await expect(
        constructorList.getByText('Говяжий метеорит (отбивная)')
      ).toBeVisible();
      await expect(
        constructorList.getByText('Сыр с астероидной плесенью')
      ).toBeVisible();
    });
  });

  test('открывает и закрывает модалку с описанием ингредиента по крестику', async () => {
    await test.step('Кликаем по карточке ингредиента', async () => {
      await bunCard.getByRole('link').click();
    });

    await test.step('Проверяем, что модалка открылась и содержит данные', async () => {
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
      await expect(modal.getByText('Калории, ккал')).toBeVisible();
    });

    await test.step('Закрываем модалку по крестику', async () => {
      await modal.getByLabel('Закрыть').click();
      await expect(modal).toBeHidden();
    });
  });

  test('закрывает модалку ингредиента по клику на оверлей', async ({ page }) => {
    await test.step('Открываем модалку ингредиента', async () => {
      await bunCard.getByRole('link').click();
      await expect(page.getByTestId('modal')).toBeVisible();
    });

    await test.step('Кликаем по оверлею и проверяем, что модалка закрылась', async () => {
      await overlay.click({ position: { x: 10, y: 10 } });
      await expect(modal).toBeHidden();
    });
  });

  test('в модалке отображаются данные именно кликнутого ингредиента', async () => {
    const targetName = 'Соус традиционный галактический';

    await test.step('Кликаем по карточке соуса', async () => {
      await sauceCard.getByRole('link').click();
    });

    await test.step('Проверяем, что в модалке именно данные соуса', async () => {
      await expect(modal).toBeVisible();
      await expect(modal.getByText(targetName)).toBeVisible();
      await expect(modal.getByText('Краторная булка N-200i')).not.toBeVisible();
    });
  });

  test('оформляет заказ и очищает конструктор', async ({ page, context }) => {
    await test.step('Подставляем моковые токены авторизации', async () => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'Bearer fake-access-token',
          domain: 'localhost',
          path: '/',
        },
      ]);
      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'fake-refresh-token');
      });
    });

    await test.step('Мокаем запрос на получение данных пользователя', async () => {
      await page.route('**/api/auth/user', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            user: { email: 'test@test.ru', name: 'Tester' },
          }),
        });
      });
    });

    await test.step('Мокаем запрос на создание заказа', async () => {
      await page.route('**/api/orders', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Краторный бургер',
            order: { number: 558 },
          }),
        });
      });
    });

    await test.step('Перезагружаем страницу для применения токенов', async () => {
      await page.reload();
      await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible();
    });

    await test.step('Собираем бургер: булка и все три начинки', async () => {
      await bunCard.getByRole('button', { name: 'Добавить' }).click();

      await sauceCard.getByRole('button', { name: 'Добавить' }).click();

      await meatCard.getByRole('button', { name: 'Добавить' }).click();

      await cheeseCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Оформляем заказ', async () => {
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
    });

    await test.step('Проверяем модалку с верным номером заказа', async () => {
      await expect(modal).toBeVisible();
      await expect(modal.getByText('идентификатор заказа')).toBeVisible();
      await expect(modal.getByText('558')).toBeVisible();
    });

    await test.step('Проверяем, что конструктор пуст', async () => {
      await expect(constructorList.getByText('Выберите начинку')).toBeVisible();
    });

    await test.step('Закрываем модалку и проверяем успешность закрытия', async () => {
      await modal.getByLabel('Закрыть').click();
      await expect(modal).toBeHidden();
    });
  });
});
