// library.js
"use strict";

const { processStoredFile } = require("./lib/upload-plus");
const controllers = require("./lib/controllers");
const settings = require("./lib/settings");

const init = async (params) => {
  const { router, middleware } = params;
  const routeHelpers = require.main.require("./src/routes/helpers");

  // Инициализация настроек
  await settings.init();

  routeHelpers.setupAdminPageRoute(
    router,
    "/admin/plugins/upload-plus",
    controllers.renderAdminPage,
  );

  // ── Bearer-token API route (no CSRF) ──────────────────────────────────────
  // Роут регистрируется через static:app.load ДО applyCSRF middleware NodeBB.
  // /api/v3/plugins/* — официальное пространство для плагинов,
  // CSRF здесь не применяется, аутентификация идёт по Bearer-токену.
  const uploadsController = require.main.require("./src/controllers/uploads");
  const multer = require.main.require("./node_modules/multer");
  const os = require("os");

  const upload = multer({ dest: os.tmpdir() });

  // Возвращает JSON 401 вместо redirect-а на /login
  const requireAuth = (req, res, next) => {
    if (!req.uid) {
      return res.status(401).json({
        status: {
          code: "not-authorised",
          message: "Valid Bearer token required",
        },
        response: {},
      });
    }
    next();
  };

  /**
   * POST /api/v3/plugins/upload-api/upload
   *
   * Загрузка файлов через Bearer-токен без CSRF.
   * Полностью эквивалентна /api/post/upload — хук filter:uploadStored
   * срабатывает автоматически (подпапки + WebP конвертация).
   *
   * Headers:  Authorization: Bearer <token>
   * Body:     multipart/form-data, поле: files[]
   *
   * Ответ: такой же JSON как у стандартного /api/post/upload
   */
  router.post(
    "/api/v3/plugins/upload-api/upload",
    [
      middleware.authenticateRequest, // Bearer → req.uid
      requireAuth,                    // JSON 401 если uid=0
      upload.array("files[]", 20),    // multer: парсим multipart
      middleware.validateFiles,       // проверка типов/размеров
      middleware.uploads.ratelimit,   // rate limit NodeBB
      // applyCSRF намеренно отсутствует
    ],
    async (req, res) => {
      try {
        await uploadsController.uploadPost(req, res);
      } catch (err) {
        res.status(500).json({
          status: { code: "internal-server-error", message: err.message },
          response: {},
        });
      }
    },
  );
};

const filterUploadStored = async (data) => {
  return await processStoredFile(data);
};

const addAdminNavigation = (header) => {
  header.plugins.push({
    route: "/plugins/upload-plus",
    icon: "fa-upload",
    name: "Upload Plus",
  });
  return header;
};

module.exports = {
  init,
  filterUploadStored,
  addAdminNavigation,
};
