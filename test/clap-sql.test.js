'use strict';

const mock = require('egg-mock');

describe('test/clap-sql.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/clap-sql-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, clapSql')
      .expect(200);
  });
});
