import { Then, When } from "@cucumber/cucumber";
import { PlaywrightWrapper } from "../utils/wrapper";
import { ac, r } from "@faker-js/faker/dist/airline-BUL6NtOJ";

const getWrapper = (world: any) => new PlaywrightWrapper(world.page, world.context);

 When('Click on the Accounts tab', async function () {
              const wrapper = getWrapper(this);
             await wrapper.isVisible('//a[text()="Accounts"]');          
             await wrapper.click(`//a[text()="Accounts"]`);
         });

       When('Click on the Create Account button', async function () {
              const wrapper = getWrapper(this);
            await wrapper.click('//a[text()="Create Account"]');
         });

           When('Enter account name as {string}', async function (accName:string) {
              const wrapper = getWrapper(this);
              const randomNum = Math.floor(1000 + Math.random() * 9000);
              const uniqueAcc=`${accName}_${randomNum}`
           await wrapper.fill('//input[@id="accountName"]',uniqueAcc);
         });

         When('Enter description as {string}', async function (Desc:string) {
              const wrapper = getWrapper(this);
           await wrapper.fill('//textarea[@name="description"]',Desc);


         });
         When('Enter number of employees as {string}', async function (empCOunt:string) {
              const wrapper = getWrapper(this);
            await wrapper.fill('//input[@id="numberEmployees"]',empCOunt);
         });

          When('Enter site name as {string}', async function (site:string) {
              const wrapper = getWrapper(this);
           await wrapper.fill('//input[@id="officeSiteName"]',site);
         });

          When('Click on Create Account button', async function () {
              const wrapper = getWrapper(this);
          await wrapper.click('//input[@class="smallSubmit"]');
         });

 
         Then('Verify that the title contains {string} after account is created', async function (PageTitle:string) {
              const wrapper = getWrapper(this);
              
           const title = await wrapper.getTitle();
          console.log("Page Title:", title);

  if (title.includes(PageTitle)) {
    console.log("✓ Title verified successfully");
  } else {
    console.log("✗ Title not verified");
  }
         });