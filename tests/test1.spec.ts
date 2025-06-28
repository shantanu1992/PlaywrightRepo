import {test, expect} from '@playwright/test';
import * as dotenv from 'dotenv'
import { faker } from '@faker-js/faker';

dotenv.config()

test.beforeEach(async({page})=>{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
})

test('testcase desc', async ({page}) => {
    
    // await page.locator('#username').fill('rahulshettyacademy')
    // await page.getByLabel('Password').fill('learning')
    //await page.viewportSize({'max'})
    test.setTimeout(30000);
    await page.waitForLoadState('networkidle');
    console.log('URL:', page.url());
    
    await page.fill('#username', process.env.E2E_USERNAME || '')
    await page.fill('#password', process.env.E2E_PASSWORD || '')
    await page.getByRole('button',{name:'Sign In'}).click()
    //expect(await page.locator('.navbar-brand').first().textContent()).toEqual('ProtoCommerce')
    //await page.screenshot({ path: 'before-navbar-check.png' });
    //await expect(page.locator('.navbar-brand').first()).toHaveText('ProtoCommerce');

    await page.screenshot({ path: 'before-card-check.png' });
    const itemToAdd = ['iphone X', 'Samsung', 'Nokia']
    for(const item of itemToAdd){
        await page.locator('.card.h-100').filter({hasText:item}).
        getByRole('button',{name:'Add'}).click()
    }
    await page.getByText('Checkout').click()
    const cartItems = page.locator('h4 a')
    
    let sum = 0
    for(let i=0; i< await cartItems.count(); i++){
        const itemName = await cartItems.nth(i).textContent()
        expect(itemName).toContain(itemToAdd[i])
    }
    const rows = page.locator('tr')
    for(let i=1; i<await rows.count(); i++){
        const priceText = await rows.nth(i).locator('td').nth(4).textContent()
        const price = parseFloat(priceText?.replace(/[^\d]/g,'') || '0')
        sum += price  
    }
    const actualPriceText = await page.locator('h3 strong').textContent()
    const actualPrice = parseFloat(actualPriceText?.replace(/[^\d]/g, '')|| '0')
    expect(sum).toEqual(actualPrice)
    await page.getByRole('button', {name:'Checkout'}).click()
    await page.locator('#country').fill('ind')
    await page.locator('#country').press('ArrowDown')
    await page.locator("div[class='suggestions'] li").first().click({timeout:10000})
    //await page.locator('#checkbox2').click()
    //await page.getByRole('checkbox',{name:'I agree with the'}).check()
    await page.locator('label[for="checkbox2"]').check();
    await page.getByRole('button', {name:'Purchase'}).click()
    expect(await page.locator('.alert-success').textContent()).toContain('Success')
})

test.skip('Checking unsuccessful login', async ({page})=>{
    
    const fakeName = faker.internet.email()
    const fakePass = faker.internet.password()
    await page.fill('#username',fakeName)
    await page.fill('#password', fakePass)
    await page.getByRole('button',{name:'Sign In'}).click()
    //await page.waitForTimeout(4000)
    await expect(page.locator('div.alert-danger')).toHaveAttribute('style', 'display: block;')
})