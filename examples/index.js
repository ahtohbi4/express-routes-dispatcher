import Router from '../index';
import routes from './app/routes';

const router = new Router(routes, {
    baseDir: 'examples/app',
    debug: true,
});

router.start();
