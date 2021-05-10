import { ToolsUtil } from '../utils/tools.util'

export class UploadDir {
  /**
   * 学生头像
   */

  public static avatarStudent = 'image/avatar/student/' + ToolsUtil.getRandomFileName();

  /**
   * 教师头像
   */

  public static avatarTeacher = 'image/avatar/teacher/' + ToolsUtil.getRandomFileName();

  /**
   * 班级头像
   */

  public static avatarClass = 'image/avatar/class/' + ToolsUtil.getRandomFileName();

  /**
   * 奖励设置
   */

  public static rewardFile = 'image/reward_file/' + ToolsUtil.getRandomFileName();

  /**
   * 公司数据包
   */

  public static companyFile = 'image/company_file/' + ToolsUtil.getRandomFileName();

  /**
   * 素材文件
   */

  public static coursewareDoc = 'courseware/doc/' + ToolsUtil.getRandomFileName();

  /**
   * 素材视频
   */

  public static coursewareVideo = 'courseware/video/' + ToolsUtil.getRandomFileName();

  /**
   * 案例静态化文件
   */

  public static coursewareCaseStatic = 'courseware/case/static/' + ToolsUtil.getRandomFileName();

  /**
   * 案例音频文件
   */

  public static coursewareCaseAudio = 'courseware/case/audio/' + ToolsUtil.getRandomFileName();

  /**
   * 案例附件文件
   */

  public static coursewareCaseDoc = 'courseware/case/doc/' + ToolsUtil.getRandomFileName();

  /**
   * 案例附件文件
   */
  public static Editor = 'editor/' + ToolsUtil.getRandomFileName();

  /**
   * 导入习题
   */

  public static questionUpload = 'data/questionUpload/' + ToolsUtil.getRandomFileName();

  /**
   * 官网banner
   */

  public static officalImage = 'official/image/' + ToolsUtil.getRandomFileName();

  /**
   * 官网banner
   */

  public static officalVideo = 'official/video/' + ToolsUtil.getRandomFileName();

  /**
   * 知识图谱
   */

  public static knowledgeGraph = 'knowledge/grap/' + ToolsUtil.getRandomFileName();

  /**
   * 知识图谱视频
   */

  public static knowledgeVideo = 'knowledge/video/' + ToolsUtil.getRandomFileName();

  /**
   * 知识图谱文件
   */

  public static knowledgeFile = 'knowledge/file/' + ToolsUtil.getRandomFileName();

  /**
   * 任务
   */
  public static Task = 'task';
}
