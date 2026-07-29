import { Then, When } from "@cucumber/cucumber";
import { PlaywrightWrapper } from "../utils/wrapper";

const getWrapper = (world: any) => new PlaywrightWrapper(world.page, world.context);

 When('Click on the Leads tab', async function () {
              const wrapper = getWrapper(this);
            await wrapper.click('//a[text()="Leads"]');
         });

  
         When('Click on the Create Lead link', async function () {
              const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Create Lead"]');         });

         When('Enter company name as {string}', async function (compName:string) {
              const wrapper = getWrapper(this);
           await wrapper.fill('#createLeadForm_companyName', compName);
         });

          When('Enter first name as {string}', async function (fName:string) {
              const wrapper = getWrapper(this);
           await wrapper.fill('#createLeadForm_firstName',fName);
         });

  
         When('Enter last name as {string}', async function (lName:string) {
              const wrapper = getWrapper(this);
            
  await wrapper.fill('#createLeadForm_lastName', lName);
         });

          When('Enter title as {string}', async function (title:string) {
              const wrapper = getWrapper(this);
           await wrapper.fill('#createLeadForm_generalProfTitle', title);
         });


         When('Click on Create Lead button', async function () {
              const wrapper = getWrapper(this);
            await wrapper.click('//input[@name="submitButton"]');
         });

         Then('Verify that the title contains {string} after lead is created', async function (PageTitle:string) {
              const wrapper = getWrapper(this);
          const title = await wrapper.getTitle();
          console.log(`Page title: ${title}`);

          if (title.includes(PageTitle)) {
           console.log('Title verified');
           } else {
          console.log('Title not verified');
          }
         });