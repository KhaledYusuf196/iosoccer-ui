import { IosoccerUiPage } from './app.po';

describe('iosoccer-ui App', function() {
  let page: IosoccerUiPage;

  beforeEach(() => {
    page = new IosoccerUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
