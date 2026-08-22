import { Given, When } from "@cucumber/cucumber";
import { PlaywrightWrapper } from "../utils/wrapper";
import { isCallChain } from "typescript/lib/typescript";
import { BASE_URL } from "../config/config";
import { FakerData } from "../utils/fakerUtils";

const getWrapper = (world: any) => new PlaywrightWrapper(world.page, world.context);


         Given('Load the Leaftaps login page', async function () {
                const wrapper = getWrapper(this);
             await wrapper.navigateTo(process.env.BASE_URL as string);
         });

         When('Enter the username as {string}', async function (Username:string) {
              const wrapper = getWrapper(this);
             await wrapper.fill('//input[@id="username"]',Username);
         });



         When('Enter the password as {string}', async function (Pwd:string) {
              const wrapper = getWrapper(this);
              await wrapper.fill('//input[@id="password"]',Pwd);
         });


         When('Click on the Login button', async function () {
              const wrapper = getWrapper(this);
                await wrapper.click('//input[@class="decorativeSubmit"]');
         });

         When('Click on CRMSFA link', async function () {
              const wrapper = getWrapper(this);
            await wrapper.click('//a[contains(text(),"CRM/SFA")]');
         });