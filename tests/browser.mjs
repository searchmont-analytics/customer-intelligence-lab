import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const base = new URL('../index.html', import.meta.url).href;
const output = fileURLToPath(new URL('./output/', import.meta.url));
await mkdir(output, { recursive: true });
const routes = [
  ['home','landing'], ['executive-1','executiveTour'], ['executive-3','executiveTour'],
  ['technical','technicalTour'], ['experience','experience'],
  ['module-1','hub'], ['module-2','methodology'], ['module-3','segmentation'],
  ['module-4','voice'], ['module-5','portfolio'], ['module-6','leadership']
];
const browser = await chromium.launch({ headless: true });
let checked = 0;
try {
  for (const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844},{width:320,height:720}]) {
    const context = await browser.newContext({ viewport, reducedMotion:'reduce', deviceScaleFactor:1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const [route,id] of routes) {
      await page.goto(base + '#' + route, {waitUntil:'load'});
      await page.locator('#'+id).waitFor({state:'visible'});
      assert.equal(await page.locator('#main > section:not(.hide)').count(),1,'Exactly one active view: '+route);
      const dimensions = await page.evaluate(() => ({
        actual:document.documentElement.scrollWidth, viewport:innerWidth,
        main:document.getElementById('main').getBoundingClientRect().width
      }));
      assert.ok(dimensions.actual <= dimensions.viewport+2, 'Page overflow at '+viewport.width+'px / '+route+': '+JSON.stringify(dimensions));
      assert.ok(dimensions.main > 0, 'Main content available');
      assert.deepEqual(errors,[],'Browser errors at '+route);
      if (viewport.width===1440||viewport.width===390) {
        await page.screenshot({path:output+'/'+viewport.width+'-'+route+'.png'});
      }
      checked++;
    }

    await page.goto(base+'#experience');
    const early = page.locator('.profile-timeline');
    assert.equal(await early.locator('h4').filter({hasText:'Voice Network Analyst · OLG'}).count(),1);
    assert.equal(await early.locator('h4').filter({hasText:'Quality Assurance Analyst · OLG'}).count(),1);
    assert.match(await early.innerText(),/2007–2009\s+Voice Network Analyst/);
    assert.match(await early.innerText(),/2009–2011\*\s+Quality Assurance Analyst/);
    await page.locator('#skipToContent').focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash,'#experience');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'main');

    if (viewport.width<=900) {
      assert.equal(await page.locator('#sidebar').isVisible(),false);
      await page.locator('#menuToggle').click();
      assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('#sidebar').isVisible(),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'false');
      await page.locator('#menuToggle').click();
    } else {
      assert.equal(await page.locator('#sidebar').isVisible(),true);
      assert.equal(await page.locator('#menuToggle').isVisible(),false);
    }
    await page.locator('#nav button[data-route="1"]').click();
    await page.locator('#methodology').waitFor({state:'visible'});
    assert.equal(new URL(page.url()).hash,'#module-2');
    if(viewport.width<=900) assert.equal(await page.locator('#sidebar').isVisible(),false);

    await page.locator('#methodology .module-index summary').click();
    await page.locator('[data-jump="section-methodology-2"]').click();
    assert.equal(await page.evaluate(()=>document.activeElement.id),'section-methodology-2');
    assert.equal(new URL(page.url()).hash,'#module-2');

    await page.goto(base+'#executive-1');
    await page.locator('#tourNext').click();
    assert.equal(new URL(page.url()).hash,'#executive-2');
    await page.goBack();
    assert.equal(new URL(page.url()).hash,'#executive-1');
    await page.locator('#tourStatus').waitFor({state:'visible'});
    assert.match(await page.locator('#tourStatus').innerText(),/Stop 1 of 5/);

    await page.goto(base+'#module-3');
    await page.locator('#segK').selectOption('4');
    assert.equal(await page.locator('#segK').inputValue(),'4');
    assert.ok(await page.locator('#segPlot').isVisible());

    await page.goto(base+'#module-5');
    const table = page.locator('#portfolio .table-wrap[data-wide="true"]').first();
    await table.waitFor({state:'visible'});
    if(viewport.width===390||viewport.width===320) {
      assert.ok(await table.evaluate(el=>el.scrollWidth>el.clientWidth),'Wide mobile table must scroll internally');
    }
    await table.focus();
    assert.equal(await table.evaluate(el=>document.activeElement===el),true);
    await page.locator('#pfProtect').check();
    await page.locator('#pfApply').click();
    assert.ok(await page.locator('#pfProjectRows').isVisible());
    assert.deepEqual(errors,[],'Interaction errors at '+viewport.width);
    await context.close();
    console.log('PASS '+viewport.width+'px: '+routes.length+' routes, navigation, career timeline, keyboard focus, module controls and table scrolling');
  }
  console.log('PASS '+checked+' route/viewport combinations; screenshots in tests/output/');
} finally {
  await browser.close();
}
